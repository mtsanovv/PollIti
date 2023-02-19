#!/bin/bash

# This is PollIti containerization driver script, it only calls functions from the containerization_functions.sh file

POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR="$(dirname "$0")"
POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/logs"

POLLITI_CONTAINERIZATION_FUNCTIONS="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/container/containerization_functions.sh"
POLLITI_CONTAINERIZATION_CONFIG="${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}/containerization_config.yml"

if [ ! -f "${POLLITI_CONTAINERIZATION_FUNCTIONS}" ]; then
    echo "FATAL: Auxiliary file ${POLLITI_CONTAINERIZATION_FUNCTIONS} not found, has it been deleted?"
    exit 1
fi

source "${POLLITI_CONTAINERIZATION_FUNCTIONS}"

print_header

echo -e "Current working directory: ${PWD}\n\n"

if [ ! -f "${POLLITI_CONTAINERIZATION_CONFIG}" ]; then
    echo "FATAL: Containerization configuration file ${POLLITI_CONTAINERIZATION_CONFIG} does not exist - create it in ${POLLITI_CONTAINERIZATION_SCRIPT_WORK_DIR}"
    exit 1
fi

mkdir -p "${POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR}"
if [ "$?" != "0" ]; then
    echo "FATAL: Failed to create containerization logs directory: ${POLLITI_CONTAINERIZATION_SCRIPT_LOGS_DIR}"
fi

check_podman
create_volumes_sources
build_images

exit 0