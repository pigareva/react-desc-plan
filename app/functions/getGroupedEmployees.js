/**
 * Returns grouped employees.
 *
 * @param {Object} departmentIndex
 * @return {Array}
 */
export default function getGroupedEmployees(departmentIndex) {
  if (!departmentIndex) {
    throw new TypeError('`departmentIndex` is not defined');
  }

  return Object.values(departmentIndex);
}
