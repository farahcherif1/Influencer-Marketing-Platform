import type { PackageData } from '../Types/Creator';

export const validatePackage = (pkg: PackageData, requireDuration = true) => {
  const errors: Record<string, string> = {};

  if (!pkg.contentType?.trim()) errors.contentType = 'Content type is required.';
  if (!pkg.quantity?.toString().trim()) errors.quantity = 'Quantity is required.';
  if (!pkg.price?.toString().trim()) {
    errors.price = 'Price is required.';
  } else if (Number(pkg.price) < 20) {
    errors.price = 'Price must be at least $20.';
  }
  if (requireDuration) {
    if (!pkg.duration?.toString().trim()) errors.duration = 'Duration is required.';
    if (!pkg.durationUnit?.trim()) errors.durationUnit = 'Duration unit is required.';
  }

  return errors;
};
