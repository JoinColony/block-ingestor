/*
 * Log to console with name and timestamp
 * Used for basic stuff, which will always be logged
 */
export const output = (...messages: any[]): void =>
  console.log(new Date().toJSON(), ...messages);

/*
 * Log to console with name and timestamp
 * This should be added to internals, which you don't always want to show in production
 * This is controlled by the `VERBOSE_OUTPUT` env variable
 */
export const verbose = (...messages: any[]): void => {
  const verboseOutput = process.env.VERBOSE_OUTPUT === 'true';
  if (verboseOutput) {
    output(...messages);
  }
};
