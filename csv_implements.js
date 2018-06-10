const ak = 'GSEcVhNVMzjFympEWRH9EOkmZw7mbKRp';
const req_url = 'http://api.map.baidu.com/geocoder/v2/?address={{ad}}&output=json&ak=' + ak;
const file_path = './test.xlsx'
const dev = true

let XLSX = require('xlsx');
let http = require('http');
let workbook = XLSX.readFile(file_path);
let sheetNames = workbook.SheetNames; 
let worksheet = workbook.Sheets[sheetNames[0]];

let json_data = XLSX.utils.sheet_to_json(worksheet);
let arr = json_data.map(v => v['地址']);
let result = [], k = 0;
for(let v of arr) {
    let url = encodeURI(req_url.replace(/{{ad}}/, v));
    http.get(url, res => {
        let html = '';
        res.setEncoding('utf-8');
        res.on('data', chunk => {
            html += chunk;
        });
        res.on('end', _ => {
            html = JSON.parse(html).result.location;
            let obj = {
                address: v,
                lnt: html.lng,
                lat: html.lat
            }
            result[k++] = obj;
            if (dev) {
                // 网速有点慢，测试前五个
                if(k == 5) {
                    console.log(result)
                    return
                }
            }
        })
    })
}