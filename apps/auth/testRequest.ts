import fetch from "node-fetch";

async function test() {
  const res = await fetch("http://localhost:4000/api/auth/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Miguel Fernández",
      email: "miguel@test.com",
      rut: "12345678-9",
      password: "123456"
    })
  });

  const data = await res.json();
  console.log(data);
}

test();
