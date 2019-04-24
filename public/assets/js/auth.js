FB.init({
    appId: '429300321209901',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.2'
});

$(".login-with-facebook").click(function(event) {
  window.location.href = "account.html";
});

$(".login-with-google").click(function(event) {
	window.location.href = "account.html";
});