import JsdsAPI from './src/jsdsapi';


let main = {
  async main(){
    console.log('main');
  },

  async jsds(){
    let api = new JsdsAPI();
    let result = await api.login('320900100121588','123456');
    console.log(result);
  }
}

main.jsds();//.then(()=>process.exit());
