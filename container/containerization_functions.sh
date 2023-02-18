#!/bin/bash

# Contains functions that are used by the containerization script containerize.sh

POLLITI_MYSQL_CONTAINER_NAME="polliti_mysql"
POLLITI_BACKEND_CONTAINER_NAME="polliti_backend"
POLLITI_FRONTEND_CONTAINER_NAME="polliti_frontend"

POLLITI_MYSQL_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_mysql"
POLLITI_BACKEND_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_backend_application.properties"
POLLITI_FRONTEND_VOLUME_PATH="${HOME}/polliti_podman_volumes/polliti_frontend_config.js"

POLLITI_CONTAINERIZATION_CONFIG_PARSER="${PWD}/container/containerization_config_parser.sh"

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

    echo "Skipping '${POLLITI_MYSQL_CONTAINER_NAME}' container volume source creation because the directory already exists: ${POLLITI_MYSQL_VOLUME_PATH}"
    return 1
}

function create_file_volume_source {
    local container_name="$1"
    local source="$2"
    local dest="$3"
    local should_print_newline="$4"

    if [ ! -f "${dest}" ]; then
        parse_containerization_yaml_config
        check_containerization_specific_config_parameters "${container_name}"

        echo "Creating '${container_name}' container volume source..."
        cp "${source}" "${dest}"
        if [ "$?" != "0" ]; then
            echo "...FATAL: could not copy ${source} to ${dest}"
            exit $?
        fi

        echo -e "...DONE.\n"

        # the last function call, perhaps the replace one should get passed should_print_newline
        return 1
    fi

    echo "Skipping '${container_name}' container volume source creation because the file already exists: ${dest}"
    if [ "${should_print_newline}" == "1" ]; then
        echo
    fi
    return 1
}

function create_volumes_sources {
    local backend_volume_source_dist="./src/backend/config/application.properties.dist"
    local frontend_volume_source_dist="./src/frontend/panel/config/config.js.dist"

    create_mysql_volume_source
    create_file_volume_source "${POLLITI_BACKEND_CONTAINER_NAME}" "${backend_volume_source_dist}" "${POLLITI_BACKEND_VOLUME_PATH}"
    create_file_volume_source "${POLLITI_FRONTEND_CONTAINER_NAME}" "${frontend_volume_source_dist}" "${POLLITI_FRONTEND_VOLUME_PATH}" 1

    return 1
}