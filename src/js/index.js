window.addEventListener('load', function () {
    var prev = document.querySelector('.prev');
    var next = document.querySelector('.next');
    var banners = document.querySelector('.banners');
    var images = document.querySelector('.images');
    var dots = document.querySelector('.dots');
    var banners_width = banners.offsetWidth;
    var num = 0;
    var circle = 0;
    var timer;

    // 设置左右箭头初始显示状态
    prev.style.display = 'block';
    next.style.display = 'block';

    banners.addEventListener('mouseenter', function () {
        clearInterval(timer);
        timer = null;
    });

    banners.addEventListener('mouseleave', function () {
        timer = setInterval(function () {
            next.click();
        }, 2000);
    });

    for (var i = 0; i < images.children.length; i++) {
        var li = document.createElement('li');
        li.setAttribute('index', i);
        li.innerText = i + 1; // 显示页数
        dots.appendChild(li);

        li.addEventListener('click', function () {
            for (var i = 0; i < dots.children.length; i++) {
                dots.children[i].className = '';
            }
            this.className = 'active';
            var index = this.getAttribute('index');
            num = index;
            circle = index;
            animate(images, -index * banners_width);
        });
    }

    dots.children[0].className = 'active';

    var first = images.children[0].cloneNode(true);
    images.appendChild(first);

    next.addEventListener('click', function () {
        if (num == images.children.length - 1) {
            images.style.left = 0;
            num = 0;
        }
        num++;
        animate(images, -num * banners_width);
        circle++;
        if (circle == dots.children.length) {
            circle = 0;
        }
        circleChange();
    });

    prev.addEventListener('click', function () {
        if (num == 0) {
            num = images.children.length - 1;
            images.style.left = -num * banners_width + 'px';
        }
        num--;
        animate(images, -num * banners_width);
        circle--;
        circle = circle < 0 ? dots.children.length - 1 : circle;
        circleChange();
    });

    function circleChange() {
        for (var i = 0; i < dots.children.length; i++) {
            dots.children[i].className = '';
        }
        dots.children[circle].className = 'active';
    }

    timer = setInterval(function () {
        next.click();
    }, 2000);

});

function animate(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer)
            if (callback) {
                callback();
            }
        }
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 15);
}
