import { supabase } from "./db_connection.ts";
import { faker } from "@faker-js/faker";

async function seedDatabase() {
  try {
    const rolesData = ["admin", "user", "shelter"];
    await supabase.from("role").insert(rolesData.map(r => ({ roletype: r })));

    const { data: roles } = await supabase.from("role").select("id");
    if (!roles) throw new Error("No hay roles en la tabla role");

    const usersData = Array.from({ length: 5 }).map(() => ({
      role: faker.helpers.arrayElement(roles.map(r => r.id)),
      rut: faker.string.numeric(8) + "-" + faker.string.numeric(1),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      validated: faker.datatype.boolean(),
      address: faker.location.streetAddress(),
      description: faker.lorem.sentence(),
      createdat: faker.date.past(),
      updatedat: faker.date.recent()
    }));
    await supabase.from("users").insert(usersData);

    const { data: users } = await supabase.from("users").select("id");
    if (!users) throw new Error("No hay usuarios en la tabla users");

    const petsData = Array.from({ length: 5 }).map(() => ({
      ownerid: faker.helpers.arrayElement(users.map(u => u.id)),
      species: faker.helpers.arrayElement(["perro", "gato"]),
      name: faker.person.firstName(),
      gender: faker.helpers.arrayElement(["macho", "hembra"]),
      age: faker.number.int({ min: 1, max: 15 }),
      size: faker.helpers.arrayElement(["pequeño", "mediano", "grande"]),
      sterilized: faker.datatype.boolean(),
      adopted: faker.datatype.boolean(),
      createdat: faker.date.past(),
      updatedat: faker.date.recent()
    }));
    await supabase.from("pet").insert(petsData);

    const { data: pets } = await supabase.from("pet").select("id");
    if (!pets) throw new Error("No hay mascotas en la tabla pet");

    const postsData = Array.from({ length: 5 }).map(() => ({
      creatorid: faker.helpers.arrayElement(users.map(u => u.id)),
      petid: faker.helpers.arrayElement(pets.map(p => p.id)),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(["active", "closed"]),
      createdat: faker.date.past(),
      updatedat: faker.date.recent()
    }));
    await supabase.from("post").insert(postsData);

    const { data: posts } = await supabase.from("post").select("id");
    if (!posts) throw new Error("No hay posts en la tabla post");

    const messagesData = Array.from({ length: 5 }).map(() => ({
      creatorid: faker.helpers.arrayElement(users.map(u => u.id)),
      postid: faker.helpers.arrayElement(posts.map(p => p.id)),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(["sent", "read"]),
      createdat: faker.date.past(),
      updatedat: faker.date.recent()
    }));
    await supabase.from("message").insert(messagesData);

    const adoptionRequestsData = Array.from({ length: 5 }).map(() => ({
      postid: faker.helpers.arrayElement(posts.map(p => p.id)),
      userid: faker.helpers.arrayElement(users.map(u => u.id)),
      message: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(["pending", "approved", "rejected"]),
      createdat: faker.date.past(),
      updatedat: faker.date.recent()
    }));
    await supabase.from("adoption_request").insert(adoptionRequestsData);

    const adoptionHistoryData = Array.from({ length: 3 }).map(() => ({
      petid: faker.helpers.arrayElement(pets.map(p => p.id)),
      fromownerid: faker.helpers.arrayElement(users.map(u => u.id)),
      toownerid: faker.helpers.arrayElement(users.map(u => u.id)),
      postid: faker.helpers.arrayElement(posts.map(p => p.id)),
      createdat: faker.date.past()
    }));
    await supabase.from("adoption_history").insert(adoptionHistoryData);

    const reportsData = Array.from({ length: 3 }).map(() => ({
      userid: faker.helpers.arrayElement(users.map(u => u.id)),
      postid: faker.helpers.arrayElement(posts.map(p => p.id)),
      description: faker.lorem.sentence(),
      resolved: faker.datatype.boolean(),
      createdat: faker.date.past(),
      updatedat: faker.date.recent()
    }));
    await supabase.from("report").insert(reportsData);

    console.log("✅ Base de datos poblada correctamente usando Faker");
  } catch (error) {
    console.error("❌ Error al hacer seed:", error);
  }
}

seedDatabase();
