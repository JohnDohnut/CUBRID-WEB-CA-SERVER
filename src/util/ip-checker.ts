export function isValidIPv4(ip: string): boolean {
  const IPV4_REGEX =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return IPV4_REGEX.test(ip);
}

export function isValidIPv6(ip: string): boolean {
  const IPV6_REGEX = /^(([0-9a-fA-F]{1,4}):){7}([0-9a-fA-F]{1,4})$/;
  return IPV6_REGEX.test(ip);
}
