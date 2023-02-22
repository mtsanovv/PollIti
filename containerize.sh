#!/bin/bash

# This is PollIti containerization driver script, it only calls functions from the containerization_functions.sh file

EXIT_CODE_SUCCESS=0
EXIT_CODE_FAILURE=1

POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR=$(cd "$(dirname ""${BASH_SOURCE[0]}"")" &> /dev/null && pwd)
POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/logs"

POLLITI_CONTAINERIZATION_FUNCTIONS="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/containerization_functions.sh"
POLLITI_CONTAINERIZATION_CONFIG="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/containerization_config.yml"

POLLITI_APP_EXPOSED_PORT="8080"
POLLITI_APP_ADMIN_USER="pollitiAdmin"
POLLITI_APP_ADMIN_USER_PASSWORD_CONFIG_PROPERRTY="POLLITIADMIN_USER_PASSWORD"

if [ ! -f "${POLLITI_CONTAINERIZATION_FUNCTIONS}" ]; then
    echo "FATAL: Auxiliary file ${POLLITI_CONTAINERIZATION_FUNCTIONS} not found, has it been deleted?"
    exit "${EXIT_CODE_FAILURE}"
fi

source "${POLLITI_CONTAINERIZATION_FUNCTIONS}"

print_header

echo "Current directory: ${PWD}"
echo -e "Work directory: ${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}\n\n"

if [ ! -f "${POLLITI_CONTAINERIZATION_CONFIG}" ]; then
    echo "FATAL: Containerization configuration file ${POLLITI_CONTAINERIZATION_CONFIG} does not exist - create it in ${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}"
    exit "${EXIT_CODE_FAILURE}"
fi

check_required_binaries
create_logs_dir
create_volumes_sources
build_images
create_pod
create_containers
start_pod

echo -e "PollIti is now accessible at http://localhost:${POLLITI_APP_EXPOSED_PORT}/panel/#/login"
echo -e "\tMaster admin username: ${POLLITI_APP_ADMIN_USER}\n\tMaster admin password: The value of ${POLLITI_APP_ADMIN_USER_PASSWORD_CONFIG_PROPERRTY} from ${POLLITI_CONTAINERIZATION_CONFIG}\n\n"
exit 0