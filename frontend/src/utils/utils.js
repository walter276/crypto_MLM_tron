export const validateTronAdddress = async (address) => {
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ address, visible: true }),
  };

  try {
    const response = await fetch('https://api.shasta.trongrid.io/wallet/validateaddress', options);
    const data = await response.json();

    //   console.log(data);

    if (data.result === true) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
