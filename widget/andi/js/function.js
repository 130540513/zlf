
		var api_url = localStorage.getItem('api_url');

		/////  初始化执行   S /////
		/////  apiready  一打开就执行的 函数
		apiready = function() {

			//下拉刷新
			api.setCustomRefreshHeaderInfo({
				bgColor: '#fff',
				images: [
					'widget://image/app/xiala/1.png',
                    'widget://image/app/xiala/2.png',
                    'widget://image/app/xiala/3.png',
                    'widget://image/app/xiala/4.png',
                    'widget://image/app/xiala/5.png',
                    'widget://image/app/xiala/6.png',
                    'widget://image/app/xiala/7.png',
                    'widget://image/app/xiala/8.png',
				],
				tips: {
					pull: '你…你想干什么！你不要过来！',
					threshold: '讨厌 快放开我 非礼呀！',
					load: '急速影视 享受生活'
				}

			}, function() {
				//下拉刷新被触发，自动进入加载状态，使用 api.refreshHeaderLoadDone() 手动结束加载中状态
				setTimeout(function() {
					api.refreshHeaderLoadDone()
				}, 3000);
			});
			//下拉刷新

			api.parseTapmode();
			//获取当前APP版本
			var appVersion = api.appVersion;
			var vsion = $api.byId('vsion');
			vsion.innerHTML = '当前版本：' + appVersion;

			api.parseTapmode();

			getCache(); //计算缓存

			//监听重新获取客服联系方式广播
			api.addEventListener({
				name: 'newLoingdata'
			}, function(ret, err) {
				if(ret) {

					getData();
					location.reload();
				}
			});

			//获取数据
			getData();

		}
		/////  初始化执行   E /////

		/////////////联系客服 方法  kefu  S  客服根据代理设置自动调用  ////////////
		function kefu() {
			if(localStorage.getItem('user_id') < 1) {
				api.alert({
					title: '请先登录',
					msg: '知道了',
				});
			} else {
				var dialogBox = api.require('dialogBox');
				dialogBox.alert({
					texts: {
						content: localStorage.getItem('url') + localStorage.getItem('user_weichat'),
						leftBtnTitle: '知道了',
						rightBtnTitle: '复制'
					},
					styles: {
						bg: '#fff',
						w: 300,
						content: {
							color: '#000',
							size: 14
						},
						left: {
							marginB: 7,
							marginL: 20,
							w: 130,
							h: 35,
							corner: 2,
							bg: '#ff7600',
							color: '#fff',
							size: 14
						},
						right: {
							marginB: 7,
							marginL: 10,
							w: 130,
							h: 35,
							corner: 2,
							bg: '#ff7600',
							color: '#fff',
							size: 14
						}
					}
				}, function(ret) {
					if(ret.eventType == 'left') {
						var dialogBox = api.require('dialogBox');
						dialogBox.close({
							dialogName: 'alert'
						});
					} else if(ret.eventType == 'right') {
						var clipBoard = api.require('clipBoard');
						clipBoard.set({
							value: localStorage.getItem('user_weichat')
						}, function(ret, err) {
							if(ret) {
								api.toast({
									msg: '已复制号码到剪切板',
									duration: 2000
								});
								var dialogBox = api.require('dialogBox');
								dialogBox.close({
									dialogName: 'alert'
								});
							} else {

							}
						});
					}
				});
			}
		}

		/////////////联系管理 方法  kefu  E   ////////////

		/*
		    function openWin(name){
		      if (localStorage.getItem('user_id')<1) {
		        api.openWin({
		            name: 'login',
		            url: './login.html',
		        });
		        return;
		      }else {
		        var delay = 0;
		        if(api.systemType != 'ios'){
		            delay = 300;
		        }

		        api.openWin({
		            name: ''+name+'',
		            url: ''+name+'.html',
		            bounces:false,
		            delay: delay,
		            slidBackEnabled:true,
		            vScrollBarEnabled:false
		        });
		      }

		    }
		*/

		/////////////获取会员数据 方法  getData  S   ////////////

		function getData() {

			var user_id = localStorage.getItem('user_id');
			var user_name = localStorage.getItem('user_name');
			var user_time = localStorage.getItem('user_time');

			var status = $api.byId('status'); //账号状态  用于判断封号
			var s1 = formatDateTime(user_time);
			var timestamp = Date.parse(new Date()) / 1000;
			var time_ico = $api.byId('time_ico');
			var time = $api.byId('time');
			var islogin = $api.byId('islogin');
			var islogin_vip = $api.byId('islogin_vip');
			var ispower = $api.byId('ispower');
			var isloginOrOut = $api.byId('isloginOrOut');
			//			var userlogo = $api.byId('userlogo');
			//			var userImg = $api.byId('user_img');
			//alert(user_time);
			if(user_time > timestamp) {
				time_ico.innerHTML = ' 超级会员';
				time.innerHTML = ' 将于 ' + s1 + ' 到期';
				islogin_vip.innerHTML = ' <img src="../image/app/vip_huangjin.png" alt=""  style=" width: 80px; height: 25px; ">';
			}
			if(user_time < timestamp) {
				time_ico.innerHTML = ' 已过期';
				time.innerHTML = 'VIP已到期 请及时续费';
				islogin_vip.innerHTML = ' <img src="../image/app/vip_guoqi.png" alt=""  style=" width: 80px; height: 25px; ">';
			}
			if(user_time == "-1") {
				time_ico.innerHTML = ' 超级会员';
				time.innerHTML = ' 永久会员';
				islogin_vip.innerHTML = ' <img src="../image/app/vip_yongjiu.png" alt="" style=" width: 80px; height: 25px; ">';
			}

			if(user_id == "1") {
				time_ico.innerHTML = ' 管理员 ';
				time.innerHTML = ' 欢迎回来！';

				//				weichat.innerHTML = 'QQ：41886527';
				islogin_vip.innerHTML = ' <img src="../image/app/vip_guanfang.png" alt="" style=" width: 45px; height: 15px; ">';

				islogin.innerHTML = '' + user_name;
				isloginOrOut.innerHTML = ' <div class="aui-panel-time"  onclick="exitLogin()">安全退出</div>';
				//				userlogo.innerHTML = ' <img id="user_img" src="http://pic.92mv.net/toux/acgurl.php" alt="" style="box-shadow: 0 2px 6px 0 rgba(0,0,0,0.3);" alt="">';
			}

			if(localStorage.getItem('user_id') < 1) {
				time_ico.innerHTML = ' - - - ';
				time.innerHTML = ' ';
				islogin_vip.innerHTML = ' ';
				isloginOrOut.innerHTML = ' <div class="aui-panel-time"  onClick="toLogin()">立刻登录</div>';
				//				userlogo.innerHTML = ' <img id="user_img" src="../image/app/defaultuser.png" alt="" style="box-shadow: 0 2px 6px 0 rgba(0,0,0,0.3);" alt="">';
			}

			if(localStorage.getItem('user_name') > 1) {

				islogin.innerHTML = '' + user_name;
				isloginOrOut.innerHTML = ' <div class="aui-panel-time"  onclick="exitLogin()">安全退出</div>';
				//				userlogo.innerHTML = ' <img id="user_img" src="http://pic.92mv.net/toux/acgurl.php" alt="" style="box-shadow: 0 2px 6px 0 rgba(0,0,0,0.3);" alt="">';

				if(localStorage.getItem('accountLogin') == 1) {
					islogin.innerHTML = localStorage.getItem('Other_name');
					//					var userImg = $api.byId('user_img');
					//					userImg.src = localStorage.getItem('Other_img');
				}

				//获取客服微信号
				var user_weichat = localStorage.getItem('user_weichat');

				//				weichat.innerHTML = '微信号：' + user_weichat;

				//获取积分

				//如果已经登录就执行下面 获取积分
				api.parseTapmode();
				api.ajax({
					url: api_url + '/login/login/sign.html',
					method: 'get',
					data: {
						values: {
							uid: localStorage.getItem('user_id')
						}
					}
				}, function(ret, err) {
					if(ret) {
						var sign = $api.byId('sign');
						sign.innerHTML = ret.msg['share'];
						var moneys = $api.byId('moneys');
						moneys.innerHTML = ret.msg['je'];
						var money = $api.byId('money');
						money.innerHTML = ret.msg['ds'];

					}

				});

				api.ajax({
					url: api_url + '/login/login/share.html',
					method: 'get',
					data: {
						values: {
							uid: localStorage.getItem('user_id')
						}
					}
				}, function(ret, err) {
					if(ret) {
						var bili = $api.byId('bili');
						jifenbi = ret.sign;
						//      bili.innerHTML = ret.sign+'积分可以兑换1天会员资格哦！';
						api.hideProgress();

					} else {
						api.toast({
							msg: '信息获取失败 请检查网络是否通畅！',
							duration: 5000
						});
					}
				}); //积分获取结束

			}

			////获取 权力
			api.ajax({
				url: api_url + '/login/login/sign.html',
				method: 'get',
				data: {
					values: {
						uid: localStorage.getItem('user_id')
					}
				}
			}, function(ret, err) {
				if(ret) {
					var ispower = $api.byId('ispower');
					if(ret.msg['power'] == "0") {
						//						ispower.innerHTML = '     <img src="../image/app/vip_guanfang.png" alt="" style=" width: 45px; height: 15px;  margin-left: 5px;"> ';
						document.getElementById("hiddenDiv").style.display='';
					}



					if(ret.msg['power'] == "1") {
						//						ispower.innerHTML = '     <img src="../image/app/vip_hehuoren.png" alt="" style=" width: 45px; height: 15px;  margin-left: 5px;"> ';
						document.getElementById("hiddenDiv").style.display='';
					}

				}

			});
		}
		/////////////获取会员数据 方法  getData  E   ////////////

		/////////////未登录检测 提醒 方法  doItPerSecond  S  （定时检测）  ////////////
		//未登录提示
		var timer = setInterval(function() {
			doItPerSecond();
		}, 20000)

		function doItPerSecond() {

			if(localStorage.getItem('user_id') < 1) {

				api.toast({
					msg: '还没登陆 部分功能受限',
					duration: 3000
				});

			}

		}
		/////////////未登录检测 提醒 方法  doItPerSecond  E  （定时检测）  ////////////

		/////////////会员过期时间获取  方法  formatDateTime  S   ////////////
		function formatDateTime(timeStamp) {
			var date = new Date();
			date.setTime(timeStamp * 1000);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d;
		};
		/////////////会员过期时间获取  方法  formatDateTime  E   ////////////

		/////////////会员登录判断  方法  toLogin  S   ////////////
		function toLogin() {

			//判断   如果user_id大于0 （已登录） 并且 VIP时间为永久时  弹出提示
			if(localStorage.getItem('user_id') > 0 && localStorage.getItem('user_time') == "-1") {

				api.toast({
					msg: '永久VIP  无需升级 感谢支持！',
					duration: 2000
				});

			} else {

				//判断   如果user_id大于0 （已登录） 并且 VIP时间不等于永久时  跳转升级
				if(localStorage.getItem('user_id') > 0 && localStorage.getItem('user_time') !== "-1") {
					api.openWin({
						name: 'open_vip_win',
						url: './open_vip_win.html',
						delay: 300,
					});

					//判断   如果user_id小于0 （未登录） 跳转登录
				} else {
					api.openWin({
						name: 'login',
						url: './login.html',
						delay: 300,
					});
				}

			}

		}
		/////////////会员登录判断  方法  toLogin  E   ////////////

		// 如果已经登录 就跳转到VIP升级
		/*
		    function toVip(){

		        if (user_id>0 ) {
		          api.openWin({
		              name: 'open_vip_win',
		              url: './open_vip_win.html',
		              delay: 300,
		          });
		        }else {     //否则跳转到登录
		          api.openWin({
		              name: 'login',
		              url: './login.html',
		              delay: 300,
		          });

		        }

		    }

		*/

		////////////退出登录 方法  exitLogin   s   ////////////
		function exitLogin() {
			api.sendEvent({
				name: 'newLoingdata',
				extra: {}
			});
			/*
			   api.showProgress({
			        title: '稍后...',
			        text: '正在退出...',
			        modal: false
			    });
			    */
			localStorage.setItem('user_id', '');
			localStorage.setItem('user_name', '');
			localStorage.setItem('user_time', '');
			localStorage.setItem('Other_img', '');
			localStorage.setItem('Other_name', '');
			api.toast({
				msg: ' 已安全退出',
				duration: 2000
			});
			var islogin = $api.byId('islogin');
			var isloginOrOut = $api.byId('isloginOrOut');
			isloginOrOut.innerHTML = ' <div class="aui-panel-time"  onClick="toLogin()">立刻登录</div>';
			islogin.innerHTML = '急速影视';
			//			api.openWin({});
		}
		////////////退出登录 方法  exitLogin   E   ////////////

		////////////打开页面 方法  openWin   S   ////////////

		function openWin(name) {

			//如果判断没有登录 就提示  并跳转到登录页面
			if(localStorage.getItem('user_id') < 1) {

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;
			}
			//↑↑↑↑↑↑↑上面LEEi   新加

			//网络连接判断S

			api.ajax({
				url: api_url + '/login/login/banben.html',
				method: 'get'
			}, function(ret, err) {
				if(ret) {

					var delay = 0;
					if(api.systemType != 'ios') {
						delay = 300;
					}
					api.openWin({
						name: '' + name + '',
						url: '' + name + '.html',
						bounces: false,
						delay: delay,
						slidBackEnabled: true,
						vScrollBarEnabled: false
					});

				} else {

					//网络连接失败 进行提示
					NetworkConnectionFailurePrompt();

				}

			});
			//网络连接判断E

		}
		////////////打开页面 方法  openWin   e   ////////////

		//签到

		function qiandao() {
			if(localStorage.getItem('user_id') > 0) {
				var qdfbxx = Math.floor(Math.random() * 3);
				api.showProgress({
				    title: '木啊...',
				    text: '签了个到...',
				    modal: false
				});
				document.getElementById('audio').play();
				api.ajax({
					url: api_url + '/login/login/qiand.html',
					method: 'get',
					data: {
						values: {
							uid: localStorage.getItem('user_id'),
							qdjbx: qdfbxx
						}
					}
				}, function(ret, err) {
					api.hideProgress();
					if(ret) {
						if(ret.code == 1) {
							alert('恭喜您获得' + qdfbxx + '签到积分！^-^');
							api.ajax({
						        url: api_url+'/login/login/sign.html',
						        method: 'get',
						        data: {
						            values: {
						                uid: localStorage.getItem('user_id')
						            }
						        }
						    },function(ret, err){
						        if (ret) {
						            var sign = $api.byId('sign');
						            sign.innerHTML = ret.msg['share'];
						            var sign1 = $api.byId('sign1');
						            sign1.innerHTML = ret.msg['share'];

						        } else {
						          api.hideProgress();
						          /*
						            alert('网络错误');
						        */
						            api.toast({
						                msg: '网络错误',
						                duration: 5000
						            });


						        }
						    });
						} else if(ret.code == 0) {
							api.hideProgress();
							alert('您今天已经签到过了！^-^');
						}
					}
				});
			} else {
				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300,
				});
			}
		}

		////////////观看记录 方法  look_record   S   ////////////
		function look_record() {

			//如果判断没有登录 就提示  并跳转到登录页面
			if(localStorage.getItem('user_id') < 1) {

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;
			}

			//网络连接判断S

			api.ajax({
				url: api_url + '/login/login/banben.html',
				method: 'get'
			}, function(ret, err) {
				if(ret) {

					api.openWin({
						name: 'look_record',
						url: 'look_record.html'
					});

				} else {

					//网络连接失败 进行提示
					NetworkConnectionFailurePrompt();

				}

			});
			//网络连接判断E

		}

		////////////观看记录 方法  look_record   e   ////////////

		////////////清楚缓存 方法  cleaCache   S   ////////////

		function cleaCache() {
			api.clearCache(function() {
				api.toast({
					msg: '清除完成'
				});
				getCache();
			});
		}
		////////////清楚缓存 方法  cleaCache   E   ////////////

		////////////计算缓存 方法  getCache   S   ////////////
		function getCache() {
			api.getCacheSize(function(ret) {
				var size = ret.size / 1024 / 1024;
				var mb = size.toFixed(2)
				var cache = $api.byId('cache');
				cache.innerHTML = mb + 'MB';

			});
		}
		////////////计算缓存 方法  getCache   E   ////////////

		/////////////观看帮助 方法  videoHelp   S   ////////////
		function videoHelp() {

			api.toast({
				msg: '开发中'
			});
		}
		/////////////观看帮助 方法  videoHelp   E   ////////////

		/////////////留言反馈 方法  liuyan   S   ////////////
		function liuyan() {

			api.toast({
				msg: '开发中'
			});
		}
		/////////////留言反馈 方法  liuyan   E   ////////////

		/////////////代理帮助 方法  dailiHelp   S   ////////////
		function dailiHelp() {

			api.toast({
				msg: '开发中'
			});
		}
		/////////////代理帮助 方法  dailiHelp   E   ////////////

		/////////////代理介绍 方法  dailiJieshao   S   ////////////
		function dailiJieshao() {

			api.toast({
				msg: '开发中'
			});
		}
		/////////////代理介绍 方法  dailiJieshao   E   ////////////

		/////////////联系管理 方法  kefuWeixin   S   ////////////
		function kefuWeixin() {

			//如果判断没有登录 就提示  并跳转到登录页面
			if(localStorage.getItem('user_id') < 1) {

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;
			}

			//获取客服微信号
			var user_weichat = localStorage.getItem('user_weichat');
			var clipBoard = api.require('clipBoard');
			if(user_weichat == 'null') {

				clipBoard.set({
					value: '41886527'
				}, function(ret, err) {
					if(ret) {
						api.toast({
							msg: '微信号已复制到剪切板',
							duration: 2000
						});
						var dialogBox = api.require('dialogBox');
						dialogBox.close({
							dialogName: 'alert'
						});
					} else {

					}
				});

			} else {
				clipBoard.set({
					value: localStorage.getItem('user_weichat')
				}, function(ret, err) {
					if(ret) {
						api.toast({
							msg: '微信号已复制到剪切板',
							duration: 2000
						});
						var dialogBox = api.require('dialogBox');
						dialogBox.close({
							dialogName: 'alert'
						});
					} else {

					}
				});
			}

			//    api.toast({
			//      msg: '客服微信号已复制'
			//    });
		}

		/////////////联系管理 方法  kefuWeixin   E   ////////////

		/////////////更新app 方法  checkUpdate   E  （在apicloud进行）  ////////////
		function checkUpdate() {
			var mam = api.require('mam');
			mam.checkUpdate(function(ret, err) {
				if(ret) {
					var result = ret.result;
					if(result.update == true && result.closed == false) {
						//  var str = '新版本号:' + result.version + '\n更新内容:' + result.updateTip  //下载地址:' + ';发布时间:' + result.time; + result.source + '; 需要的可以加上去
						var str = '发布时间:' + result.time + '\n更新内容:\n' + result.updateTip //下载地址:' + ';发布时间:' + result.time; + result.source + '; 需要的可以加上去
						api.confirm({
							title: '已有新版本 V' + result.version,
							msg: str,
							buttons: ['更新', '取消']
						}, function(ret, err) {
							if(ret.buttonIndex == 1) {
								if(api.systemType == "android") {
									api.download({
										url: result.source,
										report: true
									}, function(ret, err) {
										if(ret && 0 == ret.state) { /* 下载进度 */
											api.toast({
												msg: "正在更新应用" + ret.percent + "%",
												duration: 2000
											});
										}
										if(ret && 1 == ret.state) { /* 下载完成 */
											var savePath = ret.savePath;
											api.installApp({
												appUri: savePath
											});
										}
									});
								}
								if(api.systemType == "ios") {
									api.installApp({
										appUri: result.source
									});
								}
							}
						});
					} else {
						/*
						  api.alert({
						      msg : "已是最新版，无需更新！"
						  });
						  */
						api.toast({
							msg: "已是最新版，无需更新！",
							duration: 5000
						});
					}
				} else {
					api.alert({
						msg: err.msg
					});
				}
			});
		}

		/////////////更新app 方法  checkUpdate   E   ////////////

		///////代理登录方法  s  //////

		//获取数据
		function DailiLogin() {
			/*  var user_id = localStorage.getItem('user_id');
			  var user_name = localStorage.getItem('user_name');
			  var user_password = localStorage.getItem('password');
			  var user_power = localStorage.getItem('power');   //权力  用于判断管理员
			  //alert(user_time);
			*/

			if(localStorage.getItem('user_id') < 1) {
				//如果没登陆

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;

			}

			//普通用户检测
			if(localStorage.getItem('user_name') != null && localStorage.getItem('user_name') != undefined && localStorage.getItem('user_name') != '' && localStorage.getItem('user_name') != '') {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 0) {
							/*    api.hideProgress();
             alert('账号或密码不正确');
原弹窗提示*/
							api.toast({
								msg: '密码不正确或无权限！',
								duration: 5000
							});

							NoAgencyAuthority()

							return;
						} else if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '验证成功 正在登录',
								duration: 5000
							});

							//alert( JSON.stringify( ret ) );
							/*
               api.sendEvent({
                 name: 'newLoingdata',
                 extra: {
                 }
               });



               api.hideProgress();

         api.closeWin({
               });

            api.openWin({
                 name: 'h5',
                 url: 'http://v.tianzhutongcheng.com/index/index/index',
                });
*/
							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/index/index'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						}
					} else {
						api.hideProgress();
						/*   alert('网络错误！');
						      原弹窗提示*/
						api.toast({
							msg: '(ｷ｀ﾟДﾟ´)!!  网络错误 请检查！',
							duration: 5000
						});

						//alert( JSON.stringify( err ) );
						return;
					}
				});

			}

			//管理员登录
			if(localStorage.getItem('user_id') == 1) {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '管理员登录',
								duration: 5000
							});

							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/index/index'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						} else {
							api.hideProgress();
							return;
						}
					}

				});

			}

		}

		///////代理登录方法  E  //////

		///////代理取码方法  s  //////

		//获取数据
		function DailiQuma() {
			var user_id = localStorage.getItem('user_id');
			var user_name = localStorage.getItem('user_name');
			var user_password = localStorage.getItem('password');
			var user_power = localStorage.getItem('power'); //权力  用于判断管理员
			//alert(user_time);

			if(localStorage.getItem('user_id') < 1) {
				//如果没登陆

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;

			}
			//普通用户登录检测
			if(localStorage.getItem('user_name') != null && localStorage.getItem('user_name') != undefined && localStorage.getItem('user_name') != '') {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 0) {
							/*    api.hideProgress();
             alert('账号或密码不正确');
原弹窗提示*/
							api.toast({
								msg: '密码不正确或无权限！',
								duration: 5000
							});

							NoAgencyAuthority()

							return;
						} else if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '验证成功 正在登录',
								duration: 5000
							});

							//alert( JSON.stringify( ret ) );
							/*
               api.sendEvent({
                 name: 'newLoingdata',
                 extra: {
                 }
               });



               api.hideProgress();

         api.closeWin({
               });

            api.openWin({
                 name: 'h5',
                 url: 'http://v.tianzhutongcheng.com/index/index/index',
                });
*/
							var delay = 0;
							if(api.systemType != 'ios') {
								delay = 300;
							}
							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/dianka/index'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						}
					} else {
						api.hideProgress();
						/*   alert('网络错误！');
						      原弹窗提示*/
						api.toast({
							msg: '(ｷ｀ﾟДﾟ´)!!  网络错误 请检查！',
							duration: 5000
						});

						//alert( JSON.stringify( err ) );
						return;
					}
				});

			}

			//管理员取码
			if(localStorage.getItem('user_id') == 1) {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '管理员登录',
								duration: 5000
							});

							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/dianka/index'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						} else {
							api.hideProgress();
							return;
						}
					}

				});

			}

		}

		///////代理取码方法  E  //////

				///////代理专区进入方法  s  //////

		//获取数据
		function Dailizqjr() {
			var user_id = localStorage.getItem('user_id');
			var user_name = localStorage.getItem('user_name');
			var user_password = localStorage.getItem('password');
			var user_power = localStorage.getItem('power'); //权力  用于判断管理员
			//alert(user_time);

			if(localStorage.getItem('user_id') < 1) {
				//如果没登陆

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;

			}
			//普通用户登录检测
			if(localStorage.getItem('user_name') != null && localStorage.getItem('user_name') != undefined && localStorage.getItem('user_name') != '') {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 0) {
							api.toast({
								msg: '密码不正确或无权限！',
								duration: 5000
							});

							NoAgencyAuthority()

							return;
						} else if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '验证成功 正在登录',
								duration: 5000
							});

							var delay = 0;
							if(api.systemType != 'ios') {
								delay = 300;
							}
							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/getmoney/tixian.html'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						}
					} else {
						api.hideProgress();
						/*   alert('网络错误！');
						      原弹窗提示*/
						api.toast({
							msg: '(ｷ｀ﾟДﾟ´)!!  网络错误 请检查！',
							duration: 5000
						});

						//alert( JSON.stringify( err ) );
						return;
					}
				});

			}

			//管理员取码
			if(localStorage.getItem('user_id') == 1) {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '管理员登录',
								duration: 5000
							});

							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/getmoney/tixian.html'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						} else {
							api.hideProgress();
							return;
						}
					}

				});

			}

		}

		///////代理专区进入方法  E  //////

		///////代理设置方法  s  //////

		//获取数据
		function DailiShezhi() {
			var user_id = localStorage.getItem('user_id');
			var user_name = localStorage.getItem('user_name');
			var user_password = localStorage.getItem('password');
			var user_power = localStorage.getItem('power'); //权力  用于判断管理员
			//alert(user_time);

			if(localStorage.getItem('user_id') < 1) {
				//如果没登陆

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;

			}
			//普通用户登录检测
			if(localStorage.getItem('user_name') != null && localStorage.getItem('user_name') != undefined && localStorage.getItem('user_name') != '') {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 0) {
							/*    api.hideProgress();
             alert('账号或密码不正确');
原弹窗提示*/
							api.toast({
								msg: '密码不正确或无权限！',
								duration: 5000
							});

							NoAgencyAuthority()

							return;
						} else if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '验证成功 正在登录',
								duration: 5000
							});

							//alert( JSON.stringify( ret ) );
							/*
               api.sendEvent({
                 name: 'newLoingdata',
                 extra: {
                 }
               });



               api.hideProgress();

         api.closeWin({
               });

            api.openWin({
                 name: 'h5',
                 url: 'http://v.tianzhutongcheng.com/index/index/index',
                });
*/
							var delay = 0;
							if(api.systemType != 'ios') {
								delay = 300;
							}
							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/user/pass'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						}
					} else {
						api.hideProgress();
						/*   alert('网络错误！');
						      原弹窗提示*/
						api.toast({
							msg: '(ｷ｀ﾟДﾟ´)!!  网络错误 请检查！',
							duration: 5000
						});

						//alert( JSON.stringify( err ) );
						return;
					}
				});

			}

			//管理员APP设置
			if(localStorage.getItem('user_id') == 1) {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '管理员登录',
								duration: 5000
							});

							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/user/pass'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						} else {
							api.hideProgress();
							return;
						}
					}

				});

			}

		}

		///////代理设置方法  E  //////

		///////合伙人管理方法////////////
function dlgl(){
if (localStorage.getItem('user_id')<1) {
//如果没登陆
api.toast({
msg: '(急速影视提醒您！    你还没登陆！)',
duration: 2000
});
api.openWin({
     name: 'login',
     url: './login.html',
     delay: 100
 });
 return;
  }
//普通用户检测
 if (localStorage.getItem('user_name')>1) {
api.ajax({
         url: api_url+'/login/login/veify',
         method: 'POST',
         data: {
             values: {
                 username: localStorage.getItem('user_name'),
                 passwd: localStorage.getItem('password'),
             }
         }
     },function(ret, err){
         if (ret) {
           if (ret.code == 0) {
NoAgencyAuthority()
             return;
           }else if (ret.code == 1 ) {
             api.toast({
                 msg: '验证成功 正在登录',
                 duration: 5000
             });
                api.openWin({
                    name: 'daili_guanli_win',
                    url: './daili_guanli_win.html',
                    delay: 100,
                    pageParam:{url:''},
                    bgColor: 'rgba(0,0,0,0)'
                });
           }
         } else {
           api.hideProgress();
               api.toast({
                   msg: '(急速影视提醒您！  网络错误 请检查！)',
                   duration: 5000
               });
           return;
         }
     });
  }
//管理员登录
if (localStorage.getItem('user_id')==1)  {


   api.ajax({
       url: api_url+'/login/login/veify',
       method: 'POST',
       data: {
           values: {
               username: localStorage.getItem('user_name'),
               passwd: localStorage.getItem('password'),
           }
       }
   },function(ret, err){
       if (ret) {
      if (ret.code == 1) {
           api.toast({
               msg: '管理员登录',
               duration: 5000
           });
              api.openWin({
                  name: 'daili_guanli_win',
                  url: './daili_guanli_win.html',
                  delay: 100,
                  pageParam:{url:'http://v.tianzhutongcheng.com/index/getmoney/tixian.html'},
                  bgColor: 'rgba(0,0,0,0)'
              });
         }else {
         api.hideProgress();
         return;
       }
   }
});
}
}
///////合伙人管理方法////////////

		//////////////签到/////////////
  function qianDao(){
    api.ajax({
      url: api_url+'/login/login/qiandao.html',
      method: 'get',
      data: {
        values: {
          uid: localStorage.getItem('user_id')
        }
      }
      },function(ret, err){
        if(ret){
          api.toast({
            msg: ret.msg,
            duration: 5000
          });
          window.location.reload();
        }else{
          api.toast({
            msg: '服务器连接失败,签到失败!',
            duration: 5000
          });
        }
    });

  }
/////////////签到结束//////////

		///////代理用户管理方法  s  //////

		//获取数据
		function DailiGuanLi() {
			var user_id = localStorage.getItem('user_id');
			var user_name = localStorage.getItem('user_name');
			var user_password = localStorage.getItem('password');
			var user_power = localStorage.getItem('power'); //权力  用于判断管理员
			//alert(user_time);

			if(localStorage.getItem('user_id') < 1) {
				//如果没登陆

				api.toast({
					msg: '(ｷ｀ﾟДﾟ´)!!    你还没登陆！',
					duration: 2000
				});

				api.openWin({
					name: 'login',
					url: './login.html',
					delay: 300
				});
				return;

			}
			//普通用户登录检测
			if(localStorage.getItem('user_name') != null && localStorage.getItem('user_name') != undefined && localStorage.getItem('user_name') != '') {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 0) {
							NoAgencyAuthority()
							return;
						} else if(ret.code == 1) {
							api.toast({
								msg: '验证成功 正在登录',
								duration: 5000
							});
							var delay = 0;
							if(api.systemType != 'ios') {
								delay = 300;
							}
							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/vip/index'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						}
					} else {
						api.hideProgress();
						/*   alert('网络错误！');
						      原弹窗提示*/
						api.toast({
							msg: '(ｷ｀ﾟДﾟ´)!!  网络错误 请检查！',
							duration: 5000
						});

						//alert( JSON.stringify( err ) );
						return;
					}
				});

			}

			//管理员用户管理
			if(localStorage.getItem('user_id') == 1) {

				api.ajax({
					url: api_url + '/login/login/veify',
					method: 'POST',
					data: {
						values: {
							username: localStorage.getItem('user_name'),
							passwd: localStorage.getItem('password'),
						}
					}
				}, function(ret, err) {
					if(ret) {
						if(ret.code == 1) {
							/*       alert('登录成功');
							      原弹窗提示  */
							api.toast({
								msg: '管理员登录',
								duration: 5000
							});

							api.openWin({
								name: 'daili_guanli_win',
								url: './daili_guanli_win.html',
								delay: 300,
								pageParam: {
									url: 'http://v.tianzhutongcheng.com/index/vip/index'
								},
								bgColor: 'rgba(0,0,0,0)'
							});

						} else {
							api.hideProgress();
							return;
						}
					}

				});

			}

		}

		///////代理用户管理方法  E  //////

		//////////////////////    代理登录无权限提示 方法 NoAgencyAuthority  s  //////////////////////
		function NoAgencyAuthority() {

			/*理登录无权限弹窗提示*/
			var dialogBox = api.require('dialogBox');
			dialogBox.alert({
				tapClose: true, //描述：（可选项）是否点击遮罩层关闭该对话框  默认值：false
				texts: {
					content: '没有权限',
					leftBtnTitle: '以后再说',
					rightBtnTitle: '升级合伙人'
				},
				styles: {
					bg: '#fff', //（可选项）字符串类型；对话框整体背景配置，支持#、rgb、rgba、img；默认：#fff
					corner: 10, //（可选项）数字类型；对话框背景圆角大小；默认：2
					w: 300, //（可选项）数字类型；对话框的宽；默认：300
					title: { //（可选项）JSON对象；弹窗标题栏样式配置，不传则不显示标题区域
						marginT: 20, //（可选项）数字类型；标题栏与对话框顶端间距；默认：20
						icon: 'widget://image/app/dialogBoxTisi.jpg', //（可选项）字符串类型；标题前面的图标路径，要求本地路径（widget://、fs://）；图片为正方形的，如：50*50、100*100，建议开发者传大小合适的图片以适配高分辨率手机屏幕，不传则不显示
						iconSize: 80, //（可选项）数字类型；icon 图标边长大小,若 icon 不存在则此参数无效；默认：24
						titleSize: 14, //（可选项）数字类型；标题字体大小；默认：14
						titleColor: '#000' //（可选项）字符串类型；标题字体颜色，支持#、rgb、rgba；默认：#fff
					},
					content: { //（可选项）JSON 对象；文本内容配置，若不传则不显示该区域
						marginT: 20, //（可选项）数字类型；内容文本顶端与标题栏底端的距离，如果标题栏不存在，则是到窗口顶端的距离；默认：20
						marginB: 40, //（可选项）数字类型；内容文本底端与 left/right 顶端的距离，如果 left/right 都不存在，则是到对话框底端的距离；默认：20
						color: '#ff0103', //（可选项）字符串类型；内容文本字体颜色，支持 rgb、rgba、#；默认：#eee
						size: 12 //（可选项）数字类型：内容文本字体大小；默认：12
					},
					left: { //（可选项）JSON 对象；左边按钮样式配置，不传则不显示左边按钮
						marginB: 30, //（可选项）数字类型；左边按钮的下边距；默认：7
						marginL: 30, //（可选项）数字类型；左边按钮的左边距；默认：20
						w: 100, //（可选项）数字类型；左边按钮的宽；默认：130
						h: 40, //（可选项）数字类型；左边按钮的高；默认：35
						corner: 10, //（可选项）数字类型；左边按钮圆角半径；默认：0.0
						bg: '#3d3d3d', //（可选项）字符串类型；左边按钮的背景，支持rgb、rgba、#、img；默认：'#e0e'
						color: '#fff', //（可选项）字符串类型；左边按钮标题字体颜色，支持rgb，rgba、#；默认：'#007FFF'
						size: 12 //（可选项）数字类型；左边按钮标题字体大小；默认：12
					},
					right: { //（可选项）JSON 对象；右边按钮样式配置，不传则不显示右边按钮
						marginB: 30, //（可选项）数字类型；右边按钮的下边距；默认：7
						marginL: 40, //（可选项）数字类型；右边按钮左边距；默认：10
						w: 100, //（可选项）数字类型；右边按钮的宽；默认：130
						h: 40, //（可选项）数字类型；右边按钮的高；默认：35
						corner: 10, //（可选项）数字类型；右边按钮圆角半径；默认：0.0
						bg: '#ff0103', //（可选项）字符串类型；右边按钮的背景，支持rgb、rgba、#、img；默认：'#e0e'
						color: '#fff', //（可选项）字符串类型；右边按钮标题字体颜色，支持rgb、rgba、#；默认：'#007FFF'
						size: 12 //（可选项）数字类型；右边按钮标题字体大小；默认：12
					}
				}
			}, function(ret) {
				if(ret.eventType == 'left') {
					var dialogBox = api.require('dialogBox');
					dialogBox.close({
						dialogName: 'alert'
					});
				} else if(ret.eventType == 'right') {
					api.openWin({
						name: 'open_agent_win',
						url: './open_agent_win.html',
						delay: 300
					});
					var dialogBox = api.require('dialogBox');
					dialogBox.close({
						dialogName: 'alert'
					});
				}
			});
			/*    理登录无权限弹窗提示结束    */

		}
		//////////////////////    代理登录无权限提示 方法 NoAgencyAuthority  E  //////////////////////

		////////////手动开始下拉刷新的加载状态 方法  fnRefreshHeaderLoading   S   ////////////
		function fnRefreshHeaderLoading() {
			api.refreshHeaderLoading();
		};
		////////////手动开始下拉刷新的加载状态 方法  fnRefreshHeaderLoading   E   ////////////

		//////////////////////    网络连接失败提示  方法  NetworkConnectionFailurePrompt   S  //////////////////////
		function NetworkConnectionFailurePrompt() {

			/*无网络弹窗提示*/
			var dialogBox = api.require('dialogBox');
			dialogBox.alert({
				tapClose: false, //描述：（可选项）是否点击遮罩层关闭该对话框  默认值：false
				texts: {
					content: '请检查网络是否顺畅',
					leftBtnTitle: '先不管',
					rightBtnTitle: '网络设置'
				},
				styles: {
					bg: '#fff', //（可选项）字符串类型；对话框整体背景配置，支持#、rgb、rgba、img；默认：#fff
					corner: 10, //（可选项）数字类型；对话框背景圆角大小；默认：2
					w: 300, //（可选项）数字类型；对话框的宽；默认：300
					title: { //（可选项）JSON对象；弹窗标题栏样式配置，不传则不显示标题区域
						marginT: 20, //（可选项）数字类型；标题栏与对话框顶端间距；默认：20
						icon: 'widget://image/app/dialogBoxTisi.jpg', //（可选项）字符串类型；标题前面的图标路径，要求本地路径（widget://、fs://）；图片为正方形的，如：50*50、100*100，建议开发者传大小合适的图片以适配高分辨率手机屏幕，不传则不显示
						iconSize: 80, //（可选项）数字类型；icon 图标边长大小,若 icon 不存在则此参数无效；默认：24
						titleSize: 14, //（可选项）数字类型；标题字体大小；默认：14
						titleColor: '#000' //（可选项）字符串类型；标题字体颜色，支持#、rgb、rgba；默认：#fff
					},
					content: { //（可选项）JSON 对象；文本内容配置，若不传则不显示该区域
						marginT: 20, //（可选项）数字类型；内容文本顶端与标题栏底端的距离，如果标题栏不存在，则是到窗口顶端的距离；默认：20
						marginB: 40, //（可选项）数字类型；内容文本底端与 left/right 顶端的距离，如果 left/right 都不存在，则是到对话框底端的距离；默认：20
						color: '#ff0103', //（可选项）字符串类型；内容文本字体颜色，支持 rgb、rgba、#；默认：#eee
						size: 12 //（可选项）数字类型：内容文本字体大小；默认：12
					},
					left: { //（可选项）JSON 对象；左边按钮样式配置，不传则不显示左边按钮
						marginB: 30, //（可选项）数字类型；左边按钮的下边距；默认：7
						marginL: 30, //（可选项）数字类型；左边按钮的左边距；默认：20
						w: 100, //（可选项）数字类型；左边按钮的宽；默认：130
						h: 40, //（可选项）数字类型；左边按钮的高；默认：35
						corner: 10, //（可选项）数字类型；左边按钮圆角半径；默认：0.0
						bg: '#3d3d3d', //（可选项）字符串类型；左边按钮的背景，支持rgb、rgba、#、img；默认：'#e0e'
						color: '#fff', //（可选项）字符串类型；左边按钮标题字体颜色，支持rgb，rgba、#；默认：'#007FFF'
						size: 12 //（可选项）数字类型；左边按钮标题字体大小；默认：12
					},
					right: { //（可选项）JSON 对象；右边按钮样式配置，不传则不显示右边按钮
						marginB: 30, //（可选项）数字类型；右边按钮的下边距；默认：7
						marginL: 40, //（可选项）数字类型；右边按钮左边距；默认：10
						w: 100, //（可选项）数字类型；右边按钮的宽；默认：130
						h: 40, //（可选项）数字类型；右边按钮的高；默认：35
						corner: 10, //（可选项）数字类型；右边按钮圆角半径；默认：0.0
						bg: '#ff0103', //（可选项）字符串类型；右边按钮的背景，支持rgb、rgba、#、img；默认：'#e0e'
						color: '#fff', //（可选项）字符串类型；右边按钮标题字体颜色，支持rgb、rgba、#；默认：'#007FFF'
						size: 12 //（可选项）数字类型；右边按钮标题字体大小；默认：12
					}
				}
			}, function(ret) {
				if(ret.eventType == 'left') {
					var dialogBox = api.require('dialogBox');
					dialogBox.close({
						dialogName: 'alert'
					});
				} else if(ret.eventType == 'right') {

					var openset = api.require('openSet');
					openset.open({
						id: 1
					});

					var dialogBox = api.require('dialogBox');
					dialogBox.close({
						dialogName: 'alert'
					});
				}
			});
			/*    无网络弹窗提示结束    */

		}
		//////////////////////    网络连接错误提示 方法 NetworkConnectionFailurePrompt  E  //////////////////////

		function dl(){
  var user_id = localStorage.getItem('user_id');
  var user_name = localStorage.getItem('user_name');
  var user_password = localStorage.getItem('password');
  var user_power = localStorage.getItem('power');   //权力  用于判断管理员
  //alert(user_time);

  if (localStorage.getItem('user_id')<1) {
//如果没登陆

api.toast({
msg: '(急速影视提醒您！    你还没登陆！',
duration: 2000
});


 api.openWin({
     name: 'login',
     url: './login.html',
     delay: 100
 });
 return;

  }
  //普通用户登录检测
  if (localStorage.getItem('user_name')>1 ) {


     api.ajax({
         url: api_url+'/login/login/veify',
         method: 'POST',
         data: {
             values: {
                 username: localStorage.getItem('user_name'),
                 passwd: localStorage.getItem('password'),
             }
         }
     },function(ret, err){
         if (ret) {
           if (ret.code == 0) {
         /*    api.hideProgress();
             alert('账号或密码不正确');
原弹窗提示
             api.toast({
                 msg: '密码不正确或无权限！',
                 duration: 5000
             });

             */
NoAgencyAuthority()

             return;
           }else if (ret.code == 1) {
       /*       alert('登录成功');
             原弹窗提示  */
             api.toast({
                 msg: '验证成功 正在登录',
                 duration: 5000
             });


                api.openWin({
                    name: 'daili_guanli_win',
                    url: './daili_guanli_win.html',
                    delay: 100,
                    pageParam:{url:'http://v.tianzhutongcheng.com/index/user/index.html'},
                    bgColor: 'rgba(0,0,0,0)'
                });


           }
         } else {
           api.hideProgress();
         /*   alert('网络错误！');
               原弹窗提示*/
               api.toast({
                   msg: '(急速影视提醒您！  网络错误 请检查！)',
                   duration: 5000
               });

           //alert( JSON.stringify( err ) );
           return;
         }
     });


  }







  //管理员APP设置
  if (localStorage.getItem('user_id')==1)  {


     api.ajax({
         url: api_url+'/login/login/veify',
         method: 'POST',
         data: {
             values: {
                 username: localStorage.getItem('user_name'),
                 passwd: localStorage.getItem('password'),
             }
         }
     },function(ret, err){
         if (ret) {
        if (ret.code == 1) {
       /*       alert('登录成功');
             原弹窗提示  */
             api.toast({
                 msg: '管理员登录',
                 duration: 5000
             });

                api.openWin({
                    name: 'daili_guanli_win',
                    url: './daili_guanli_win.html',
                    delay: 100,
                    pageParam:{url:'http://v.tianzhutongcheng.com/index/user/index.html'},
                    bgColor: 'rgba(0,0,0,0)'
                });


           }else {
           api.hideProgress();
           return;
         }
     }


  });

  }





}
		//////////////////////    积分商城 方法  //////////////////////

				function openjfdh() {
      if (!localStorage.getItem('user_id')) {
        api.toast({
            msg: '请先登录',
            duration: 2000,
            location: 'bottom'
        });
        return;
      }
      api.openWin({
          name: 'jfdh_win',
          url: './jfdh/jfdh_win.html'
      });

    }

    function openjfdhs() {
      if (!localStorage.getItem('user_id')) {
        api.toast({
            msg: '请先登录',
            duration: 2000,
            location: 'bottom'
        });
        return;
      }
      api.openWin({
          name: 'jflist_win',
          url: './jfdh/jflist_win.html'
      });
    }
	/*    无网络弹窗提示结束    */

	function diansu(){
api.toast({
    msg: '(好消息!升级合伙人即可用点数提卡赚钱)',
    duration: 3000
});
}
