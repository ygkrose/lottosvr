var pg = require('pg');



//var uri = 'postgres://postgres:whale@localhost/lotto';
//var uri = 'postgres://adminzplezuj:JFI9KTIvIGKb@localhost/jigang';

var uri = 'postgres://sa:whale@localhost:5432/lottodb';
//var uri = 'postgresql://adminzplezuj:JFI9KTIvIGKb@127.2.216.2:5432/jigang';


exports.deleteAllTable = function (backfn) {
	pg.connect(uri, function (err, client, done) {
		if (err)
			return console.error('error fetching client del pool', err);
		client.query('delete from distdata', function (err, result) {
			if (err) {
				return console.error('error del distdata', err);
			}
            client.query('delete from distmoney', function (err, result) {
			if (err) {
				return console.error('error del distmoney', err);
			}
			client.query('delete from orgseq', function (err, result) {
				
				if (err) {
					return console.error('error del orgseq', err);
				}
				client.query('delete from maindata', function (err, result) {
					done();
					if (err) {
						return console.error('error del maindata', err);
					}
					backfn();
				});
			});
           });
		});
	});
}

exports.writeMainTable = function (data,process) {
	pg.connect(uri, function (err, client, done) {
		if (err)
			return console.error('error fetching client from pool', err);

		for (var o in data) {
			client.query('insert into maindata (period,date,totalstake,num1,num2,num3,num4,num5,num6,nums) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
				[data[o].period, data[o].adate, data[o].stake, data[o].ordernum[0], data[o].ordernum[1], data[o].ordernum[2], data[o].ordernum[3], data[o].ordernum[4], data[o].ordernum[5], data[o].specialnum]
				, function (err, result) {
					done(); //回收連線資資源
		
					if (err) {
						return console.error('error running query'  , err);
					}
				});
		}
		console.log('maindata down..'+process);
	});
}

exports.writeSeqTable = function (odata,process) {
	pg.connect(uri, function (err, client, done) {
		if (err)
			return console.error('error fetching client ', err);

		for (var o in odata) {
			client.query('insert into orgseq (period,seq1,seq2,seq3,seq4,seq5,seq6,seqs) values ($1,$2,$3,$4,$5,$6,$7,$8)',
				[odata[o].period, odata[o].orgnums[0], odata[o].orgnums[1], odata[o].orgnums[2], odata[o].orgnums[3], odata[o].orgnums[4], odata[o].orgnums[5], odata[o].specialnum], function (err, result) {
					done();

					if (err) {
						return console.error('error running insert orgseq\r\n' , err);
					}

				});
		}
		console.log('orgseq down..'+process);
	});
}

exports.writeDistTable = function (odata,process) {
	pg.connect(uri, function (err, client, done) {
		if (err)
			return console.error('error fetching DistTable ', err);

		for (var o in odata) {

			client.query('insert into distdata (period,s1,s2,s3,s4,s5,s6,s7,s8) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
				[odata[o].period, odata[o].distribute[1], odata[o].distribute[2], odata[o].distribute[3], odata[o].distribute[4], odata[o].distribute[5],
					odata[o].distribute[6], odata[o].distribute[7], odata[o].distribute[8]], function (err, result) {

						done();
                        if (err) {
							return console.error('error running insert distdata', err);
                        }
			});
		}
		console.log('DistTable down..'+process);

	});
}

exports.writeDistMoneyTable = function (odata,process) {
	pg.connect(uri, function (err, client, done) {
		if (err)
			return console.error('error fetching DistMoney ', err);

		for (var o in odata) {

			client.query('insert into distmoney (period,m1,m2,m3,m4,m5,m6,m7,m8) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
				[odata[o].period, odata[o].distmoney[1], odata[o].distmoney[2], odata[o].distmoney[3], odata[o].distmoney[4], odata[o].distmoney[5],
					odata[o].distmoney[6], odata[o].distmoney[7], odata[o].distmoney[8]], function (err, result) {

						done();
                        if (err) {
							return console.error('error running insert distdata', err);
                        }
			});
		}
		console.log('DistMoney down..'+process);

	});
}

//select * from maindata where EXTRACT(dow from odate) = 4 找出星期四的日期