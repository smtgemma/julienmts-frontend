import Container from "@/lib/Container";
import React from "react";

function InfoCounter() {
  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#F4F1FE] rounded-[16px] mx-3 md:mx-6 lg:mx-0">
        <div className="p-6 text-center">
          <div className="md:text-3xl text-xl font-bold text-[#2D2D2D] mb-4">
            100k+
          </div>
          <div className="text-sm md:text-lg lg:text-xl text-[#636F85]">
            User
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="md:text-3xl text-xl font-bold text-[#2D2D2D] mb-4">
            10,000+
          </div>
          <div className="text-sm md:text-lg lg:text-xl text-[#636F85]">
            Meetings Prepared
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="md:text-3xl text-xl font-bold text-[#2D2D2D] mb-4">
            95%
          </div>
          <div className="text-sm md:text-lg lg:text-xl text-[#636F85]">
            Success Rate
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="md:text-3xl text-xl font-bold text-[#2D2D2D] mb-4">
            10 min
          </div>
          <div className="text-sm md:text-lg lg:text-xl text-[#636F85]">
            Average Prep Time
          </div>
        </div>
      </div>
    </Container>
  );
}

export default InfoCounter;
