


export const isBetaExpired = (): boolean => {
  const currentDate = new Date();
  const betaEndDate = new Date('2025-09-05T23:59:59');
  return currentDate > betaEndDate;
};


