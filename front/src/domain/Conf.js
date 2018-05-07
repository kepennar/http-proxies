export default {
  get configs() {
    return fetch('/_admin/management').then(resp => {
      if (resp.status !== 200) {
        return Promise.reject(resp.json());
      }
      return resp.json();
    });
  },
  createNewConf(conf) {
    return fetch('/_admin/management', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conf })
    }).then(res => {
      if (parseInt(res.status / 100) !== 2) {
        return res.json().then(error => Promise.reject(error));
      }
      return res.json();
    });
  }
};
