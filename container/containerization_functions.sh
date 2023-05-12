#!/bin/bash

# Contains functions that are used by the containerization script containerize.sh

POLLITI_MYSQL_CONTAINER_NAME="polliti_mysql"
POLLITI_BACKEND_CONTAINER_NAME="polliti_backend"
POLLITI_FRONTEND_CONTAINER_NAME="polliti_frontend"
POLLITI_POD_NAME="polliti_pod"

POLLITI_MYSQL_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_mysql"
POLLITI_BACKEND_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_backend_application.properties"
POLLITI_FRONTEND_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_frontend_config.js"

POLLITI_CONTAINERIZATION_CONFIG_PARSER="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/containerization_config_parser.sh"

if [ ! -f "${POLLITI_CONTAINERIZATION_CONFIG_PARSER}" ]; then
    echo "FATAL: Auxiliary file ${POLLITI_CONTAINERIZATION_CONFIG_PARSER} not found, has it been deleted?"
    exit "${EXIT_CODE_FAILURE}"
fi

source "${POLLITI_CONTAINERIZATION_CONFIG_PARSER}"

function print_header {
    echo -e "    ____        __________  _ \n   / __ \____  / / /  _/ /_(_)\n  / /_/ / __ \/ / // // __/ / \n / ____/ /_/ / / // // /_/ /  \n/_/    \____/_/_/___/\__/_/   \n                              "
    echo -e "----- Containerization -----\n\n"
}

function check_binary {
    local binary="$1"
    local exit_code=0

    echo "Checking if you have ${binary} available..."
    type "${binary}" &> /dev/null
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: ${binary} is not available!"
        exit "${exit_code}"
    fi
    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}

function check_required_binaries {
    local binaries=("podman" "sed" "awk" "grep")
    for binary in "${binaries[@]}"
    do
        check_binary "${binary}"
    done
    return "${EXIT_CODE_SUCCESS}"
}

function create_logs_dir {
    local exit_code=0

    mkdir -p "${POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR}"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "FATAL: Failed to create containerization logs directory: ${POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR}"
        exit "${exit_code}"
    fi
    return "${EXIT_CODE_SUCCESS}"
}

function create_mysql_volume_source {
    local exit_code=0

    check_containerization_specific_config_parameters "${POLLITI_MYSQL_CONTAINER_NAME}"
    # the mysql parameters are always checked because creating the mysql container is not an optional step

    if [ ! -d "${POLLITI_MYSQL_VOLUME_PATH}" ]; then
        echo "Creating '${POLLITI_MYSQL_CONTAINER_NAME}' container volume source..."
        mkdir -p "${POLLITI_MYSQL_VOLUME_PATH}"
        exit_code=$?

        if [ "${exit_code}" != "0" ]; then
            echo "...FATAL: could not create directory: ${POLLITI_MYSQL_VOLUME_PATH}"
            exit "${exit_code}"
        fi

        echo -e "...DONE.\n"
        return "${EXIT_CODE_SUCCESS}"
    fi

    echo -e "Skipping '${POLLITI_MYSQL_CONTAINER_NAME}' container volume source creation because the directory already exists: ${POLLITI_MYSQL_VOLUME_PATH}\n"
    return "${EXIT_CODE_SUCCESS}"
}

function create_file_volume_source {
    local container_name="$1"
    local source="$2"
    local dest="$3"
    local exit_code=0

    if [ ! -f "${dest}" ]; then
        check_containerization_specific_config_parameters "${container_name}"

        echo "Creating '${container_name}' container volume source..."
        cp "${source}" "${dest}"
        exit_code=$?

        if [ "${exit_code}" != "0" ]; then
            echo "...FATAL: could not copy ${source} to ${dest}"
            exit "${exit_code}"
        fi

        echo -e "...DONE.\n"

        configure_volume_source_file "${container_name}" "${dest}"
        return "${EXIT_CODE_SUCCESS}"
    fi

    echo -e "Skipping '${container_name}' container volume source creation because the file already exists: ${dest}\n"
    return "${EXIT_CODE_SUCCESS}"
}

function create_volumes_sources {
    local backend_volume_source_dist="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/src/backend/config/application.properties.dist"
    local frontend_volume_source_dist="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/src/frontend/panel/config/config.js.dist"

    create_mysql_volume_source
    create_file_volume_source "${POLLITI_BACKEND_CONTAINER_NAME}" "${backend_volume_source_dist}" "${POLLITI_BACKEND_VOLUME_PATH}"
    create_file_volume_source "${POLLITI_FRONTEND_CONTAINER_NAME}" "${frontend_volume_source_dist}" "${POLLITI_FRONTEND_VOLUME_PATH}"

    return "${EXIT_CODE_SUCCESS}"
}

function build_image {
    local containerfile_path="$1"
    local container_name="$2"
    local image_name="${container_name}_image"
    local log_path="${POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR}/podman_build_$(date +'%Y_%m_%d_%H_%M_%S').log"
    local exit_code=0

    echo "Building podman image ${image_name}..."

    touch "${log_path}"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Could not create log file: ${log_path}"
        exit "${exit_code}"
    fi

    podman build -f "${containerfile_path}" -t "${image_name}" "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}" &> "${log_path}"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: podman image ${image_name} build failed, podman build log: ${log_path}"
        exit "${exit_code}"
    fi

    echo -e "...DONE, podman build log: ${log_path}\n"
    return "${EXIT_CODE_SUCCESS}"
}

function build_images {
    build_image "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/mysql/Containerfile" "${POLLITI_MYSQL_CONTAINER_NAME}"
    build_image "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/backend/Containerfile" "${POLLITI_BACKEND_CONTAINER_NAME}"
    build_image "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/frontend/Containerfile" "${POLLITI_FRONTEND_CONTAINER_NAME}"
    return "${EXIT_CODE_SUCCESS}"
}

function delete_pod {
    echo "Stopping pod (if it exists) ${POLLITI_POD_NAME}..."
    podman pod stop "${POLLITI_POD_NAME}" &> /dev/null

    echo -e "Deleting pod (if it exists) ${POLLITI_POD_NAME}...\n"
    podman pod rm "${POLLITI_POD_NAME}" &> /dev/null
    return "${EXIT_CODE_SUCCESS}"
}

function create_pod {
    local exit_code=0

    delete_pod
    echo "Creating pod ${POLLITI_POD_NAME}..."

    podman pod create -n "${POLLITI_POD_NAME}" -p "${POLLITI_APP_EXPOSED_PORT}:80"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Failed to create pod ${POLLITI_POD_NAME}"
        exit "${exit_code}"
    fi

    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}

function delete_container {
    local container_name="$1"

    echo "Stopping container (if it exists) ${container_name}..."
    podman stop "${container_name}" &> /dev/null

    echo -e "Deleting container (if it exists) ${container_name}...\n"
    podman rm "${container_name}" &> /dev/null
    return "${EXIT_CODE_SUCCESS}"
}

function create_mysql_container {
    local exit_code=0
    local mysql_user_in_container_uid=27
    local mysql_volume_owner_message_suffix="of ${POLLITI_MYSQL_VOLUME_PATH} as the 'mysql' user of the container (UID in container: ${mysql_user_in_container_uid})"
    local db_user_password=$(eval "echo \${${POLLITI_CONTAINERIZATION_CONFIG_PREFIX}DB_USER_PASSWORD}")
    local container_name="${POLLITI_MYSQL_CONTAINER_NAME}"

    delete_container "${container_name}"

    echo "Setting the owner ${mysql_volume_owner_message_suffix}..."

    podman unshare chown "${mysql_user_in_container_uid}" "${POLLITI_MYSQL_VOLUME_PATH}"
    exit_code=$?

    echo "Creating ${container_name} container..."
    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Failed setting the owner ${mysql_volume_owner_message_suffix}"
        exit "${exit_code}"
    fi

    podman create --name "${container_name}" \
                  --pod "${POLLITI_POD_NAME}" \
                  --volume "${POLLITI_MYSQL_VOLUME_PATH}:/var/lib/mysql/data" \
                  --health-cmd 'mysql -u polliti -p'"${db_user_password}"' <<< "SELECT 1;" || exit 1' \
                  --health-interval 0 \
                  --env MYSQL_USER=polliti \
                  --env "MYSQL_PASSWORD=${db_user_password}" \
                  --env MYSQL_DATABASE=polliti \
                  "${container_name}_image"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Failed creating container ${container_name}"
        exit "${exit_code}"
    fi

    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}

function create_backend_container {
    local exit_code=0
    local container_name="${POLLITI_BACKEND_CONTAINER_NAME}"

    delete_container "${container_name}"

    echo "Creating ${container_name} container..."

    podman create --name "${container_name}" \
                  --pod "${POLLITI_POD_NAME}" \
                  --volume "${POLLITI_BACKEND_VOLUME_PATH}:/usr/local/lib/polliti/application.properties" \
                  "${container_name}_image"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Failed creating container ${container_name}"
        exit "${exit_code}"
    fi

    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}

function create_frontend_container {
    local exit_code=0
    local container_name="${POLLITI_FRONTEND_CONTAINER_NAME}"

    delete_container "${container_name}"

    echo "Creating ${container_name} container..."

    podman create --name "${container_name}" \
                  --pod "${POLLITI_POD_NAME}" \
                  --volume "${POLLITI_FRONTEND_VOLUME_PATH}:/var/www/panel/config/config.js" \
                  --volume "${POLLITI_FRONTEND_VOLUME_PATH}:/var/www/polls/config/config.js" \
                  "${container_name}_image"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Failed creating container ${container_name}"
        exit "${exit_code}"
    fi

    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}


function create_containers {
    create_mysql_container
    create_backend_container
    create_frontend_container
    return "${EXIT_CODE_SUCCESS}"
}

function start_mysql_container {
    local exit_code=0

    echo "Starting container ${POLLITI_MYSQL_CONTAINER_NAME}..."

    podman start "${POLLITI_MYSQL_CONTAINER_NAME}"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Failed starting container ${POLLITI_MYSQL_CONTAINER_NAME}"
        exit "${exit_code}"
    fi

    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}

function init_mysql_container {
    local exit_code=0
    local healthcheck_retries_before_failure=60 # one minute worth of retries
    local db_sql_template_to_import="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/sql/polliti.sql"
    local db_user_password=$(eval "echo \${${POLLITI_CONTAINERIZATION_CONFIG_PREFIX}DB_USER_PASSWORD}")
    local pollitiadmin_user_password=$(eval "echo \${${POLLITI_CONTAINERIZATION_CONFIG_PREFIX}${POLLITI_APP_ADMIN_USER_PASSWORD_CONFIG_PROPERTY}}")

    echo "Initializing container ${POLLITI_MYSQL_CONTAINER_NAME}..."
    echo "Waiting for MySQL server inside container ${POLLITI_MYSQL_CONTAINER_NAME} to come online..."

    until podman healthcheck run ${POLLITI_MYSQL_CONTAINER_NAME} &> /dev/null
    do
        ((healthcheck_retries_before_failure--)) && ((healthcheck_retries_before_failure == 0)) && break
        sleep 1;
    done

    podman healthcheck run ${POLLITI_MYSQL_CONTAINER_NAME} # run a final check to obtain an exit code
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: MySQL server inside container ${POLLITI_MYSQL_CONTAINER_NAME} is still not online after 60s"
        exit "${exit_code}"
    fi

    echo "Creating polliti MySQL database and PollIti master admin user ${POLLITI_APP_ADMIN_USER} (if they are not available)..."

    podman exec -i "${POLLITI_MYSQL_CONTAINER_NAME}" mysql -u polliti -p"${db_user_password}" < "${db_sql_template_to_import}" &> /dev/null

    podman exec -i "${POLLITI_MYSQL_CONTAINER_NAME}" bash -c \
                'mysql -u polliti -p'"${db_user_password}"' <<< "USE polliti; INSERT INTO \`users\` (\`id\`, \`username\`, \`displayName\`, \`password\`, \`role\`, \`enabled\`) VALUES (NULL, '\'''"${POLLITI_APP_ADMIN_USER}"''\'', '\''PollIti Administrator'\'', '\''$(htpasswd -bnBC 10 "" '"${pollitiadmin_user_password}"' | tr -d '\'':\n'\'' | sed '\''s/$2y/$2a/'\'')'\'', '\''Administrator'\'', 1);"' \
                &> /dev/null

    # basically what the insane mysql command does is hash in bcrypt the app master admin password INSIDE the container and create the app master admin user

    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}

function start_pod {
    local exit_code=0
    local healthcheck_retries_before_failure=30 # 30s worth of retries
    local running_state_regex="${POLLITI_POD_NAME}\s+Running"

    start_mysql_container # we start it separately because we need to import initial data before starting all other containers
    init_mysql_container

    echo "Starting the remaining containers in ${POLLITI_POD_NAME}..."
    podman pod start "${POLLITI_POD_NAME}"
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Failed starting pod ${POLLITI_POD_NAME}"
        exit "${exit_code}"
    fi

    echo "Waiting for ${POLLITI_POD_NAME} to become in running state..."

    until podman pod ps | grep -E -i "${running_state_regex}" &> /dev/null
    do
        ((healthcheck_retries_before_failure--)) && ((healthcheck_retries_before_failure == 0)) && break
        sleep 1;
    done

    podman pod ps | grep -E -i "${running_state_regex}" &> /dev/null # run a final check to obtain an exit code
    exit_code=$?

    if [ "${exit_code}" != "0" ]; then
        echo "...FATAL: Pod ${POLLITI_POD_NAME} is still not in running state after 30s"
        exit "${exit_code}"
    fi

    echo -e "...DONE.\n"
    return "${EXIT_CODE_SUCCESS}"
}