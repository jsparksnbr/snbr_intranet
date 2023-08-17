let search = document.getElementById("btnzipcode");
search.addEventListener(
  "click",
  () => {
    let api = "https://zipcloud.ibsnet.co.jp/api/search?zipcode=";
    //let error = document.getElementById("ziperr");
    let input = document.getElementById("zipcode");
    let address1 = document.getElementById("province");
    let address2 = document.getElementById("city");
    let address3 = document.getElementById("street");
    let param = input.value.replace("-", ""); //入力された郵便番号から「-」を削除
    let url = api + param;

    fetchJsonp(url, {
      timeout: 10000, //タイムアウト時間
    })
      .then((response) => {
        //error.textContent = ""; //HTML側のエラーメッセージ初期化
        return response.json();
      })
      .then((data) => {
        if (data.status === 400) {
          //エラー時
          alert(data.message);
          //error.textContent = data.message;
        } else if (data.results === null) {
          alert("郵便番号から住所が見つかりませんでした。");
          //error.textContent = "郵便番号から住所が見つかりませんでした。";
        } else {
          address1.value = data.results[0].address1;
          address2.value = data.results[0].address2;
          address3.value = data.results[0].address3;
        }
      })
      .catch((ex) => {
        //例外処理
        console.log(ex);
      });
  },
  false
);
