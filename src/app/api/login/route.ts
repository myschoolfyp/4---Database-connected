import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const mongoUri = "mongodb://localhost:27017/myschool";

export async function POST(request: Request) {
  try {
    const { email, password, userType } = await request.json();

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    let user;

    // Check userType and fetch corresponding user from collection
    if (userType === "Admin") {
      user = await db.collection('admins').findOne({ email });
    } else if (userType === "Teacher") {
      user = await db.collection('teachers').findOne({ email });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }

    // Return the user data and userType
    return NextResponse.json(
      { 
        message: "Login successful", 
        userType: userType,    // Include the userType in the response
        user: {                // You can also return other necessary user details here
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber,
        }
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error logging in:", error.message);
      return NextResponse.json({ message: "Error logging in", error: error.message }, { status: 500 });
    }

    console.error("Unknown error during login:", error);
    return NextResponse.json({ message: "Error logging in", error: "Unknown error" }, { status: 500 });
  }
}