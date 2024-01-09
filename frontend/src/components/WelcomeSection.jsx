import { ServiceCard } from "./ServiceCard";
import { Blockquote } from "flowbite-react";
function WelcomeSection() {
  return (
    <div className="container relative flex flex-col justify-center  max-w-6xl px-10 mx-auto xl:px-0 mt-5">
      <div className="flex flex-col justify-center self-center items-center mr-[43px]">
        <h2 className="mb-1 text-3xl leading-tight text-white-600">
          Welcome to Scamless
        </h2>
        <p className="mb-1 text-lg text-white-500">
          Here is a few of the awesome Services we provide.
        </p>
        <Blockquote className="my-4 border-l-4  p-4 border-white-800 bg-[#3d3d3d] text-white-800 ">
          “Artificial intelligence is not a substitute for human intelligence;
          it is a tool to amplify human creativity and ingenuity.”
        </Blockquote>
      </div>

      <div className="w-full">
        <div className="flex flex-col w-full mb-10 sm:flex-row">
          <ServiceCard
            bgColor="bg-blue-500"
            borderColor="border-blue-500"
            textColor="text-blue-500"
            title="Real Time Data"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum,
            repudiandae hic! Magni nesciunt alias fugit ipsam blanditiis,
            impedit repellendus maiores voluptas minus, ullam sit quo quisquam
            explicabo labore? Ab, animi.
          </ServiceCard>
          <ServiceCard
            borderColor="border-purple-500"
            bgColor="bg-purple-500"
            textColor="text-purple-500"
            title="AI powered Scam Detection"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum,
            repudiandae hic! Magni nesciunt alias fugit ipsam blanditiis,
            impedit repellendus maiores voluptas minus, ullam sit quo quisquam
            explicabo labore? Ab, animi.
          </ServiceCard>
        </div>
        <div className="flex flex-col w-full mb-5 sm:flex-row">
          <ServiceCard
            borderColor="border-red-500"
            bgColor="bg-red-500"
            textColor="text-red-500"
            title="Data Analysis"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
            corporis obcaecati ad delectus possimus ipsa quidem. Commodi illum
            fugit nesciunt beatae, nobis, eaque fuga molestias itaque temporibus
            porro saepe aspernatur?
          </ServiceCard>
          <ServiceCard
            borderColor="border-yellow-500"
            bgColor="bg-yellow-500"
            textColor="text-yellow-500"
            title="Data Visualization"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            accusantium assumenda sit iste deleniti doloremque dolores hic eos
            perspiciatis unde at quas aut beatae fuga tempora error velit, vel
            fugit!
          </ServiceCard>
          <ServiceCard
            borderColor="border-green-500"
            bgColor="bg-green-500"
            textColor="text-green-500"
            title="Information at your fingertips"
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta hic
            consequuntur minima quia labore accusantium dolorum minus facilis
            quae ducimus ab, neque eius nam. Obcaecati impedit iure autem
            necessitatibus nemo.
          </ServiceCard>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
