#!/bin/bash

# This is PollIti containerization driver script, it only calls functions from the containerization_functions.sh file

POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR="$(dirname "$0")"
POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/logs"

POLLITI_CONTAINERIZATION_FUNCTIONS="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/containerization_functions.sh"
POLLITI_CONTAINERIZATION_CONFIG="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/containerization_config.yml"

POLLITI_APP_EXPOSED_PORT="8080"
POLLITI_APP_ADMIN_USER="pollitiAdmin"
POLLITI_APP_ADMIN_USER_PASSWORD_CONFIG_PROPERRTY="POLLITIADMIN_USER_PASSWORD"

if [ ! -f "${POLLITI_CONTAINERIZATION_FUNCTIONS}" ]; then
    echo "FATAL: Auxiliary file ${POLLITI_CONTAINERIZATION_FUNCTIONS} not found, has it been deleted?"
    exit 1
fi

source "${POLLITI_CONTAINERIZATION_FUNCTIONS}"

print_header

echo -e "Current directory: ${PWD}\n\n"

if [ ! -f "${POLLITI_CONTAINERIZATION_CONFIG}" ]; then
    echo "FATAL: Containerization configuration file ${POLLITI_CONTAINERIZATION_CONFIG} does not exist - create it in ${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}"
    exit 1
fi

check_required_binaries
create_logs_dir
create_volumes_sources
build_images
create_pod
create_containers
start_pod

echo -e "PollIti is now accessible at http://localhost:${POLLITI_APP_EXPOSED_PORT}/panel/#/login"
echo -e "\tMaster admin username: ${POLLITI_APP_ADMIN_USER}\n\tMaster admin assword: The value of ${POLLITI_APP_ADMIN_USER_PASSWORD_CONFIG_PROPERRTY} from ${POLLITI_CONTAINERIZATION_CONFIG}\n\n"
exit 0