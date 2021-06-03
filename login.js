var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

var btnlogin = document.getElementById('login');

btnlogin.onclick = function() {
    var a = 0;
    var b = 0;
    if (document.getElementById("taikhoan").value == "admin")
        a = 1;
    else a = 0;
    if (document.getElementById("password").value == "admin")
        b = 1;
    else
        b = 0;

    if ((a == 1) && (b == 1)) {
        window.location.href = "main.html";
        return false;
    } else {
        alert("Tài Khoản Hoặc Mật Khẩu Không Đúng!");
    }
}