<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>TogglTouch</title>
</head>
<body>
	<h1>Hello World</h1>
	<p><%=new java.util.Date()%></p>
	<p><%=request.getAttribute("color")%></p>
	<p>${message}</p>
	<form method="post" action="./HelloServlet">
		<input tyupe="text" name="hoge">
		<button type="submit">送信</button>
	</form>
</body>
</html>