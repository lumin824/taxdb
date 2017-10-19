import JsdsAPI from './src/jsdsapi';
import SddsAPI from './src/sddsapi';
import SdgsAPI from './src/sdgsapi';

import soap from 'soap';

let code2char = '0123456789ABCDEFGHJKLMNPQRTUWXV';

let uscc_flag = (code)=>{
  let flag = 'ERR';
  if(code && code.length == 17){
    let fact4 = [1,3,9,27,19,26,16,17,20,29,25,13,8,24,10,30,28];

    let sum = 0;
    let char_code_0 = '0'.charCodeAt(),
        char_code_A = 'A'.charCodeAt();
    for(let i=0;i<code.length;i++){
      let v = code2char.indexOf(code[i]);
      sum += (v * fact4[i])
    }
    flag = code2char.charAt(31 - sum % 31);
  }

  return flag;
}


let main = {
  async main(){
    console.log('main');
  },

  async jsds(){
    let api = new SdgsAPI();
    let accounts = [
      // '370782053443876','370783056200474','370785059036956','370705165526481','370786550905787',
      // '370705553360348','370705554378451','370705556735408','370705565244432','370705572895962',
      // '370725587153806','370785593643932','370702596590688','370704599277195','370782663511637',
      // '370705663513878','370781670537501','370782676840771','3707063258461','370705681709962',
      // '370785684844713','370705685942489','370705690601822','370704692044337',

      '370705694434806',

      '370705694445206','370705696889433','370786698059337','370704698062085','370782699699838',
      '370705705963827','37070472859311X','370702730678307','370783165682628','370785738184870',
      '370705744510847','370702746550981','37070475783613X','370702748959668','37070575265279X',
      '370785753500894','370705754476072','370784755418544','37078575542483X','370702755431597',
      '370722550329301','370702769736375','370703771014646','370702771032406','370705774174047',
      '370785774194187','370705775296097','370705777408187','370725777415424','370785780752093',
      '370785782308260','37072782326469','370785786107044','370705790364457','370782790387763',
      '370725797304254','370705797315121','370702798666193','370786L02530286','370784L07860065',
    ];

    // let result = await api.login('370782676840771','123456');
    // console.log(result);

    for(let i=0;i<accounts.length;i++){
      let account = accounts[i];
      // let code = '91'+account;
      // let uscc = code + uscc_flag(code);
      // console.log(`${account}-${uscc}`);
      let result = await api.login(account,'123456');

      while(result.indexOf('验证码错误！')!=-1){
        result = await api.login(account,'123456');
      }
      console.log(`${account}\t${result}`);
    }

  },
  async soap(){

    soap.createClient('http://218.57.142.38:8080/ydsw_webservice/services/LoginService?wsdl',(error, client)=>{
      client.example({in0:'123',in1:'123',in2:'123',in3:'123'}, (error, result, raw, soapHeader)=>{
        console.log(error);
        console.log(result);
        console.log(raw);
        console.log(soapHeader);
      });
    });
  }
}

main.soap();//.then(()=>process.exit());
