import yaml from 'js-yaml';

/**
 * Cleans up a Kubernetes resource object by removing managed fields,
 * last-applied-configuration annotations, and other noise before converting to YAML.
 */
export const cleanK8sObjectForYaml = (obj: any): string => {
  const cleanObj = JSON.parse(JSON.stringify(obj));

  if (cleanObj.metadata) {
    // Remove managed fields (usually very large and noisy)
    if (cleanObj.metadata.managedFields) {
      delete cleanObj.metadata.managedFields;
    }

    // Remove kubectl last-applied-configuration annotation
    if (cleanObj.metadata.annotations && cleanObj.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration']) {
      delete cleanObj.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
    }

    // Remove empty annotations or labels objects
    if (cleanObj.metadata.annotations && Object.keys(cleanObj.metadata.annotations).length === 0) {
      delete cleanObj.metadata.annotations;
    }
    if (cleanObj.metadata.labels && Object.keys(cleanObj.metadata.labels).length === 0) {
      delete cleanObj.metadata.labels;
    }
  }

  // Remove status if we only want spec (optional, but good for some views)
  // For dashboard, we usually want to see status, so we keep it.

  return yaml.dump(cleanObj, {
    indent: 2,
    noRefs: true,
    sortKeys: false,
  });
};
