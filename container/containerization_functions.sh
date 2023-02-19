#!/bin/bash

# Contains functions that are used by the containerization script containerize.sh

POLLITI_MYSQL_CONTAINER_NAME="polliti_mysql"
POLLITI_BACKEND_CONTAINER_NAME="polliti_backend"
POLLITI_FRONTEND_CONTAINER_NAME="polliti_frontend"

POLLITI_MYSQL_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_mysql"
POLLITI_BACKEND_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_backend_application.properties"
POLLITI_FRONTEND_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_frontend_config.js"

POLLITI_CONTAINERIZATION_CONFIG_PARSER="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/containerization_config_parser.sh"

if [ ! -f "${POLLITI_CONTAINERIZATION_CONFIG_PARSER}" ]; then
    echo "FATAL: Auxiliary file ${POLLITI_CONTAINERIZATION_CONFIG_PARSER} not found, has it been deleted?"
    exit 1
fi

source "${POLLITI_CONTAINERIZATION_CONFIG_PARSER}"

function print_header {
    echo -e "    ____        __________  _ \n   / __ \____  / / /  _/ /_(_)\n  / /_/ / __ \/ / // // __/ / \n / ____/ /_/ / / // // /_/ /  \n/_/    \____/_/_/___/\__/_/   \n                              "
    echo -e "----- Containerization -----\n\n"
}

function check_podman {
    echo "Checking if you have podman installed..."
    podman -v
    if [ "$?" != "0" ]; then
        echo "...FATAL: podman is not installed!"
        exit $?
    fi
    echo -e "...DONE.\n"
    return 1
}

function create_mysql_volume_source {
    if [ ! -d "${POLLITI_MYSQL_VOLUME_PATH}" ]; then
        echo "Creating '${POLLITI_MYSQL_CONTAINER_NAME}' container volume source..."
        mkdir -p "${POLLITI_MYSQL_VOLUME_PATH}"
        if [ "$?" != "0" ]; then
            echo "...FATAL: could not create directory: ${POLLITI_MYSQL_VOLUME_PATH}"
            exit $?
        fi
        echo -e "...DONE.\n"
        return 1
    fi

    echo -e "Skipping '${POLLITI_MYSQL_CONTAINER_NAME}' container volume source creation because the directory already exists: ${POLLITI_MYSQL_VOLUME_PATH}\n"
    return 1
}

function create_file_volume_source {
    local container_name="$1"
    local source="$2"
    local dest="$3"

    if [ ! -f "${dest}" ]; then
        check_containerization_specific_config_parameters "${container_name}"

        echo "Creating '${container_name}' container volume source..."
        cp "${source}" "${dest}"
        if [ "$?" != "0" ]; then
            echo "...FATAL: could not copy ${source} to ${dest}"
            exit $?
        fi

        echo -e "...DONE.\n"

        configure_volume_source_file "${container_name}" "${dest}"
        return 1
    fi

    echo -e "Skipping '${container_name}' container volume source creation because the file already exists: ${dest}\n"
    return 1
}

function create_volumes_sources {
    local backend_volume_source_dist="./src/backend/config/application.properties.dist"
    local frontend_volume_source_dist="./src/frontend/panel/config/config.js.dist"

    create_mysql_volume_source
    create_file_volume_source "${POLLITI_BACKEND_CONTAINER_NAME}" "${backend_volume_source_dist}" "${POLLITI_BACKEND_VOLUME_PATH}"
    create_file_volume_source "${POLLITI_FRONTEND_CONTAINER_NAME}" "${frontend_volume_source_dist}" "${POLLITI_FRONTEND_VOLUME_PATH}"

    return 1
}

function build_image {
    local containerfile_path="$1"
    local container_name="$2"
    local image_name="${container_name}_image"
    local log_path="${POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR}/podman_build_$(date +'%Y_%m_%d_%H_%M_%S').log"

    echo "Building podman image ${image_name}..."

    touch "${log_path}"
    if [ "$?" != "0" ]; then
        echo "...FATAL: Could not create log file: ${log_path}"
        exit $?
    fi

    podman build -f "${containerfile_path}" -t "${image_name}" "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}" &> "${log_path}"

    if [ "$?" != "0" ]; then
        echo "...FATAL: podman image ${image_name} build failed, podman build log: ${log_path}"
        exit $?
    fi

    echo -e "...DONE, podman build log: ${log_path}\n"
    return 1
}

function build_images {
    build_image "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/mysql/Containerfile" "${POLLITI_MYSQL_CONTAINER_NAME}"
    build_image "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/backend/Containerfile" "${POLLITI_BACKEND_CONTAINER_NAME}"
    build_image "${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/frontend/Containerfile" "${POLLITI_FRONTEND_CONTAINER_NAME}"
    return 1
}