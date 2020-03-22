(function (win, lib) {
	var doc = win.document;
	var docEl = doc.documentElement;
	// �豸���ر�
	var devicePixelRatio = win.devicePixelRatio;
	// �������õĲ����ӿ��������ӿڵ����ر�
	var dpr = 1;
	// viewport����ֵ
	var scale = 1;
	// ����viewport
	function setViewport() {
		// �ж�IOS
		var isIPhone = /iphone/gi.test(win.navigator.appVersion);
		// viewport ������
		dpr = 1;
		// window����������һ�����ԣ��ṩ����Ĳ����ӿ��������ӿڵ�ֵ
		win.devicePixelRatioValue = dpr;
		// viewport����ֵ�������ӿ����ź�պ���ʾ�������ӿڵĿ�ȣ�ҳ��Ͳ���������
		scale = 1 / dpr;
		// ��ȡ���е�viewport
		var hasMetaEl = doc.querySelector('meta[name="viewport"]');
		// ����У��ı�֮
		if (hasMetaEl) {
			// ios9 �������� maximum-scale minimum-scale������ҳ�����ֿ������϶���Ч��IOS9��bug���߹���Ϊ֮��
			if (isIPhone) {
				hasMetaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', user-scalable=no');
			}
			// target-densitydpi Ŀ���豸�ܶȵȼ���Ĭ��ֵmedium-dpi�����ǵ�Ŀ����css�е�1px��������������е�1px����ʹ��target-densitydpi=device-dpi
			else {
				hasMetaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
			}
		}
		// ���û�У����֮
		else {
			var metaEl = doc.createElement('meta');
			metaEl.setAttribute('name', 'viewport');
			if (isIPhone) {
				metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', user-scalable=no');
			}
			else {
				metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
			}

			if (docEl.firstElementChild) {
				docEl.firstElementChild.appendChild(metaEl);
			}
			else {
				var wrap = doc.createElement('div');
				wrap.appendChild(metaEl);
				doc.write(wrap.innerHTML);
			}
		}
	}
	setViewport();
	var newBase = 100;
	lib.errDpr = 1;

	function setRem() {
		// �����ӿ�
		// var layoutView = docEl.clientWidth; Ҳ���� ��ȡ�����ӿڵĿ��
		var layoutView;
		if (lib.maxWidth) {
			layoutView = Math.min(docEl.getBoundingClientRect().width, lib.maxWidth * dpr);
		}
		else {
			layoutView = docEl.getBoundingClientRect().width;
		}
		// Ϊ�˼��㷽�㣬���ǹ涨 1rem === 100px���ͼ���أ�������ͼ��ʱ����ܿ���ת��
		// �����ʣ�Ϊʲô����1rem === 1px��������أ�
		// ���ͼһ����640����750px
		// �����ӿ�һ����320��1440
		// ����һ��ֵ��ʹlayout���ܿ��Ϊ (desinWidth/100) rem
		// ��ô�м��㹫ʽ��layoutView / newBase = desinWidth / 100
		// newBase = 100 * layoutView / desinWidth
		// newBase = ����50��200֮��
		// ��� 1rem === 1px ������أ�newBase�ͽ���0.5��2֮�䣬���ںܶ����������С12px���ƣ����ʱ��Ͳ�������Ӧ��
		newBase = 100 * layoutView / lib.desinWidth * (lib.errDpr || 1);
		docEl.style.fontSize = newBase + 'px';
		// rem��׼ֵ�ı���ֶ�reflowһ�£�������ת�ֻ��ҳ������Ӧ����
		doc.body&&(doc.body.style.fontSize = lib.baseFont / 100 + 'rem');
		// ��������rem��Ļص�����
		lib.setRemCallback&&lib.setRemCallback();
		lib.newBase = newBase;
	}
	var tid;
	lib.desinWidth = 750;
	lib.baseFont = 24;
	// �ֲ�ˢ�µ�ʱ�򲿷�chrome�汾�����������
	lib.reflow = function() {
		docEl.clientWidth;
	};
	// ��鰲׿��remֵ�Ƿ���ʾ��ȷ
	function checkRem() {
		if (/android/ig.test(window.navigator.appVersion)) {
			var hideDiv = document.createElement('p');
			hideDiv.style.height = '1px';
			hideDiv.style.width = '2.5rem';
			hideDiv.style.visibility = 'hidden';
			document.body.appendChild(hideDiv);
			var now = hideDiv.offsetWidth;
			var right = window.adaptive.newBase * 2.5;
			if (Math.abs(right / now - 1) > 0.05) {
				lib.errDpr = right / now;
				setRem();
			}
			document.body.removeChild(hideDiv);
		}
	}
	lib.init = function () {
		// resize��ʱ����������rem��׼ֵ
		// ����orientationchange �¼�ʱҲ�ᴥ��resize���ʲ���Ҫ����Ӵ��¼���
		win.addEventListener('resize', function () {
			clearTimeout(tid);
			tid = setTimeout(setRem, 300);
		}, false);
		// ����������ж�ȡʱҲ��Ҫ��������rem��׼ֵ
		win.addEventListener('pageshow', function (e) {
			if (e.persisted) {
				clearTimeout(tid);
				tid = setTimeout(setRem, 300);
			}
		}, false);
		// ����body�ϵ������С
		if (doc.readyState === 'complete') {
			doc.body.style.fontSize = lib.baseFont / 100 + 'rem';
			checkRem();
		}
		else {
			doc.addEventListener('DOMContentLoaded', function (e) {
				doc.body.style.fontSize = lib.baseFont / 100 + 'rem';
				checkRem();
			}, false);
		}
		// ����remֵ
		setRem();
		// html�ڵ����ò����ӿ��������ӿڵ����ر�
		docEl.setAttribute('data-dpr', dpr);
	};
	// ��ЩhtmlԪ��ֻ����pxΪ��λ��������Ҫ�ṩһ���ӿڣ���rem��λ�����px
	lib.remToPx = function (remValue) {
		return remValue * newBase;
	};
})(window, window['adaptive'] || (window['adaptive'] = {}));

// ���ͼ���
window['adaptive'].desinWidth = 750;
// body �����С
window['adaptive'].baseFont = 14;

// ��ʾ����� ��ѡ
window['adaptive'].maxWidth = 1200;
// remֵ�ı��ִ�з��� ��ѡ
// window['adaptive'].setRemCallback = function () {
	// alert(1)
// }

// ��ʼ��
window['adaptive'].init();
