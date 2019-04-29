var request = require('request');
var fs = require('fs');
var pgsql = require('./postgres.js 


var WebRobot = function (dt,rtnfun) {
	var target = 'list_' + dt.year + '_' +  dt.month ;
	request('http://lotto.auzonet.com/biglotto/'+target+'.html', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var cheerio = require('cheerio');
			var $ = cheerio.load(body);
            //console.log($('.history_view_tit').html());
			if ($('td.history_view').html() == null) { 
				rtnfun({'status':'false','msg':'html is empty'});
				return; 
			}

			if (!fs.existsSync('./purehtml')) {
				fs.mkdirSync('./purehtml');
			}
			fs.writeFile('./purehtml/' + target + '.html', $('td.history_view').html(), function (err) {
				if (err)
					rtnfun({'status':'false','msg': target + err});
				else
					rtnfun({'status':'true','msg':'http://lotto.auzonet.com/biglotto/' + target + '.html'});
			});
		}else{
			rtnfun({'status':'false','msg':error});
		}
	})
}

var ParseHtml = function () {
	
	fs.readdir('./purehtml/', function (err, files) {
		if (err) throw err;
		var curr = 1;
		var totalnum = files.length;
		files.forEach(function (element) {
			
			fs.readFile('./purehtml/' + element, function (err, body) {
				if (err) throw err;
				
				var cheerio = require('cheerio');
				//console.log(body.toString())
				var $ = cheerio.load(body.toString());
				
				var prepareforDB = [];
				//console.log($('.history_view_Lottery').html());
				//var databag = {};
				$('.history_view_table').each(function (i, elem) {
					var balldata = {
						period: "",
						adate: "",
						orgnums: [],
						ordernum: [],
						specialnum: 0,
						stake: 0,
						distribute: {},
                        distmoney: {}
					}
					
					balldata.period = $(this).children('tr').eq(1).children().children().first().text() ;//期數
					balldata.adate =$(this).children('tr').eq(1).children().eq(0)[0].children[5].data.trim() ;//日期
					balldata.specialnum = $(this).children('tr').eq(1).children('td').eq(2).text();// 特別號
					balldata.stake = $(this).children('tr').eq(1).children('td').eq(3).text().substr(1).replace(/\,/g,''); //總彩金
					$(this).children('tr').eq(1).children('td').eq(1).children().first().children().first().children('a').each(function(j,num){
						balldata.orgnums.push($(this).text()); //.eq(?).text()
					});
					$(this).children('tr').eq(1).children('td').eq(1).children().last().children().last().children('a').each(function(j,num){
						balldata.ordernum.push($(this).text()); //.eq(?).text()
					});
					$(this).children('tr').eq(2).children().first().children().first().children().eq(1).children('td').each(function(k,num){
						if ($(this).text().indexOf('中獎注數')==-1){
							balldata.distribute[k]=$(this).text().replace(/\,/g,'');
						}
					});
                    $(this).children('tr').eq(2).children().first().children().first().children().eq(2).children('td').each(function(k,num){
						if ($(this).text().indexOf('獎金分配')==-1){
							balldata.distmoney[k]=$(this).text().replace(/\,/g,'');
						}
					});
					prepareforDB.push(balldata);
				});
				//updateDB here
				//console.log(prepareforDB);
				pgsql.writeMainTable(prepareforDB,curr + '/' + totalnum);
				pgsql.writeSeqTable(prepareforDB,curr + '/' + totalnum);
				pgsql.writeDistTable(prepareforDB,curr + '/' + totalnum);
                pgsql.writeDistMoneyTable(prepareforDB,curr + '/' + totalnum);
				console.log(curr + '/' + totalnum);
				curr++;
			});
		}, this);
	});
}

exports.ParseHtmlbyDate = function (dt,callfun) {
	fs.readFile('./purehtml/list_' + dt.year + '_' + dt.month + '.html', function (err, body) {
				if (err) {callfun({'status':'false','msg':err});}

				var cheerio = require('cheerio');
				//console.log(body.toString())
				var $ = cheerio.load(body.toString());
				
				var prepareforDB = [];
				//console.log($('.history_view_Lottery').html());
                //var databag = {};
                $('.history_view_table').each(function (i, elem) {
					if (dt.month.length === 1) dt.month = '0' + dt.month;
					if (dt.day.length === 1) dt.month = '0' + dt.day;
                    if ($(this).children('tr').eq(1).children().eq(0)[0].children[5].data.trim() === dt.year + '-' + dt.month + '-' + dt.day) {
                        var balldata = {
                            period: "",
                            adate: "",
                            orgnums: [],
                            ordernum: [],
                            specialnum: 0,
                            stake: 0,
                            distribute: {}
                        }

                        balldata.period = $(this).children('tr').eq(1).children().children().first().text();//期數
                        balldata.adate = $(this).children('tr').eq(1).children().eq(0)[0].children[5].data.trim();//日期
                        balldata.specialnum = $(this).children('tr').eq(1).children('td').eq(2).text();// 特別號
                        balldata.stake = $(this).children('tr').eq(1).children('td').eq(3).text().substr(1).replace(/\,/g, ''); //總彩金
                        $(this).children('tr').eq(1).children('td').eq(1).children().first().children().first().children('a').each(function (j, num) {
                            balldata.orgnums.push($(this).text()); //.eq(?).text()
                        });
                        $(this).children('tr').eq(1).children('td').eq(1).children().last().children().last().children('a').each(function (j, num) {
                            balldata.ordernum.push($(this).text()); //.eq(?).text()
                        });
                        $(this).children('tr').eq(2).children().first().children().first().children().eq(1).children('td').each(function (k, num) {
                            if ($(this).text().indexOf('中獎注數') == -1) {
                                balldata.distribute[k] = $(this).text().replace(/\,/g, '');
                            }
                        });
                        prepareforDB.push(balldata);
                        callfun(prepareforDB);
                    }
                });
				callfun({'status':'false','msg':'cannot find target date' });
			});
}

var StartCrawler = function (callfun) {
	for (var i = 2004; i <= new Date().getFullYear(); i++) {
		for (var j = 1; j <= 12; j++) {
              try {fs.statSync('./purehtml/'+'list_' + i.toString() + '_' + j.toString() + '.html');}
              catch (err){
				  var dt ={
        			year:i,
        			month:j
      				}
                var beginRobot = new WebRobot(dt,function(a){console.log(a);});
              }
			}
		}
    callfun();
}

exports.CrawlerbyDate = function (dt,callfun){
	var rbt = new WebRobot(dt,callfun);
}

var launch = function (){ 
	new StartCrawler(function () {
		pgsql.deleteAllTable(function () {
			var beginParse = new ParseHtml();
		});
	});
};
new launch();
