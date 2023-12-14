function WelcomeSection() {
  return (
    <div className="container relative flex flex-col justify-center  max-w-6xl px-10 mx-auto xl:px-0 mt-5">
      <div className="flex flex-col justify-center self-center items-center mr-[43px]">
        <h2 className="mb-1 text-3xl leading-tight text-white-600">
          Welcome to Scamless
        </h2>
        <p className="mb-12 text-lg text-white-500">
          Here is a few of the awesome Services we provide.
        </p>
      </div>

      <div className="w-full">
        <div className="flex flex-col w-full mb-10 sm:flex-row">
          <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
            <div className="relative h-full ml-0 mr-0 sm:mr-10">
              <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>
              <div className="relative h-full p-5 bg-[#2b2a33] border-2 border-indigo-500 rounded-lg">
                <div className="flex items-center -mt-1">
                  <h3 className="my-2 ml-3 text-lg font-bold text-white-800">
                    Real Time Data
                  </h3>
                </div>
                <p className="mt-3 mb-1 text-xs font-medium text-indigo-500 uppercase">
                  ------------
                </p>
                <p className="mb-2 text-white-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum,
                  repudiandae hic! Magni nesciunt alias fugit ipsam blanditiis,
                  impedit repellendus maiores voluptas minus, ullam sit quo
                  quisquam explicabo labore? Ab, animi.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="relative h-full ml-0 md:mr-10">
              <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-purple-500 rounded-lg"></span>
              <div className="relative h-full p-5 bg-[#2b2a33] border-2 border-purple-500 rounded-lg">
                <div className="flex items-center -mt-1">
                  <h3 className="my-2 ml-3 text-lg font-bold text-white-800">
                    AI powered Scam Detection
                  </h3>
                </div>
                <p className="mt-3 mb-1 text-xs font-medium text-purple-500 uppercase">
                  ------------
                </p>
                <p className="mb-2 text-white-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum,
                  repudiandae hic! Magni nesciunt alias fugit ipsam blanditiis,
                  impedit repellendus maiores voluptas minus, ullam sit quo
                  quisquam explicabo labore? Ab, animi.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mb-5 sm:flex-row">
          <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
            <div className="relative h-full ml-0 mr-0 sm:mr-10">
              <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-red-400 rounded-lg"></span>
              <div className="relative h-full p-5 bg-[#2b2a33] border-2 border-red-400 rounded-lg">
                <div className="flex items-center -mt-1">
                  <h3 className="my-2 ml-3 text-lg font-bold text-white-800">
                    Data Analysis
                  </h3>
                </div>
                <p className="mt-3 mb-1 text-xs font-medium text-red-400 uppercase">
                  ------------
                </p>
                <p className="mb-2 text-white-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
                  corporis obcaecati ad delectus possimus ipsa quidem. Commodi
                  illum fugit nesciunt beatae, nobis, eaque fuga molestias
                  itaque temporibus porro saepe aspernatur?
                </p>
              </div>
            </div>
          </div>
          <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
            <div className="relative h-full ml-0 mr-0 sm:mr-10">
              <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-yellow-400 rounded-lg"></span>
              <div className="relative h-full p-5 bg-[#2b2a33] border-2 border-yellow-400 rounded-lg">
                <div className="flex items-center -mt-1">
                  <h3 className="my-2 ml-3 text-lg font-bold text-white-800">
                    Data Visualization
                  </h3>
                </div>
                <p className="mt-3 mb-1 text-xs font-medium text-yellow-400 uppercase">
                  ------------
                </p>
                <p className="mb-2 text-white-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                  accusantium assumenda sit iste deleniti doloremque dolores hic
                  eos perspiciatis unde at quas aut beatae fuga tempora error
                  velit, vel fugit!
                </p>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="relative h-full ml-0 md:mr-10">
              <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"></span>
              <div className="relative h-full p-5 bg-[#2b2a33] border-2 border-green-500 rounded-lg">
                <div className="flex items-center -mt-1">
                  <h3 className="my-2 ml-3 text-lg font-bold text-white-800">
                    Information at your fingertips
                  </h3>
                </div>
                <p className="mt-3 mb-1 text-xs font-medium text-green-500 uppercase">
                  ------------
                </p>
                <p className="mb-2 text-white-600">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Soluta hic consequuntur minima quia labore accusantium dolorum
                  minus facilis quae ducimus ab, neque eius nam. Obcaecati
                  impedit iure autem necessitatibus nemo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
