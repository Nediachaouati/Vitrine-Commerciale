export const GetDateYyyyMmDd = (dts: string) => {
  let dt = new Date(dts);
  const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
  const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
  let res = dt.getFullYear() + '-' + month + '-' + date;
  return res;
};
