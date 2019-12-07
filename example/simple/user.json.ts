const genData = (count: number) => {
  const userData = [];
  for (let i = 0; i < count; i++) {
    userData.push({
      i,
      n: `name-${i}`,
      a: `avatar-${i}`,
      t: `t-${i}`,
      o: `o-${i}`,
      io: [
        {
          i: `io-i-${i}`
        }
      ],
      e: {
        i: i * i,
        n: `edu-name-${i}`,
        t: new Date().getTime()
      }
    });
  }
  return userData;
};

export default genData(1);
