import Container from "@/lib/Container";
import React from "react";

function About() {
  return (
    <div>
      <section>
        <div className="bg-white/60 flex w-full px-[120px] py-[80px] justify-between items-center">
          <Container className="flex w-full justify-between items-center gap-8">
            <h2>About Us</h2>
            <p>Home / About Us</p>
          </Container>
        </div>
      </section>
    </div>
  );
}

export default About;
