

export const isBetaExpired = (): boolean => {
  const currentDate = new Date();
  const betaEndDate = new Date('2026-09-04T23:59:59');
  return currentDate > betaEndDate;
};

