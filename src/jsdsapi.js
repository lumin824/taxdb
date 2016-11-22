import BaseAPI from './baseapi';

import _ from 'lodash';
import uuid from 'uuid';
import gm from 'gm';
import fs from 'fs';
import tesseract from 'node-tesseract';

export default class JsdsAPI extends BaseAPI {
  fetchCaptcha(){
    let codePath = 'code_' + uuid() + '.jpg';
    return new Promise((resolve, reject)=>{
      let stream = gm(this.httpClient.get('http://www.jsds.gov.cn/index/fujia2.jsp'))
        .operator('gray', 'threshold', 50, true).stream();
      stream.pipe(fs.createWriteStream(codePath));
      stream.on('end', ()=>{
        tesseract.process(codePath, (error, text)=>{
          fs.unlink(codePath);
          error ? reject(error) : resolve(_.trim(text));
        });
      });
    });
  }

  async login(username, password){
    let captcha = await this.fetchCaptcha();
    let ret = await this.httpPost('http://www.jsds.gov.cn/LoginAction.do', {
      form: { jsonData: JSON.stringify({
        handleCode:'baseLogin',
        data:{zh:username, zhPassWord:password, zhYzm: captcha}
      })}
    })

    return JSON.parse(ret.body);
  }
}
