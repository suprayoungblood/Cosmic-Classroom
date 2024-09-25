import React, { useState } from "react";
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard } from "@/widgets/cards";
import { featuresData, contactData } from "@/data";

export function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/ask', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Sorry, there was an error processing your question. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="relative bg-black text-white pt-48 pb-24"> {/* Increased top padding */}
        <div className="absolute top-0 h-full w-full bg-[url('/img/space-background.jpg')] bg-cover bg-center opacity-50" />
        <div className="container relative mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full px-4 text-center">
              <Typography variant="h1" color="white" className="mb-8 font-black">
                Welcome to Cosmic Classroom
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80 mb-16">
                Embark on an interstellar journey of knowledge. Explore the cosmos, 
                unravel celestial mysteries, and expand your understanding of the universe.
              </Typography>
            </div>
          </div>

          <Card className="w-full max-w-[40rem] mx-auto bg-white/10 text-white backdrop-blur-sm mb-20">
            <CardBody>
              <Typography variant="h5" color="white" className="mb-4">
                Ask the Cosmic AI
              </Typography>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about stars, planets, galaxies..."
                  className="!border !border-white/20 bg-white/10 text-white shadow-lg shadow-black/5 ring-4 ring-transparent placeholder:text-white/50 focus:!border-white focus:!border-t-white focus:ring-white/10"
                  labelProps={{
                    className: "hidden",
                  }}
                />
                <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                  {isLoading ? 'Searching the cosmos...' : 'Launch Question'}
                </Button>
              </form>
              {answer && (
                <div className="mt-4 p-4 bg-white/10 rounded">
                  <Typography variant="h6" color="white" className="mb-2">
                    Cosmic Insight:
                  </Typography>
                  <Typography className="font-normal text-white/80">
                    {answer}
                  </Typography>
                </div>
              )}
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="relative bg-white py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <RocketLaunchIcon className="h-8 w-8 text-white " />
              </div>
              <Typography
                variant="h3"
                className="mb-3 font-bold"
                color="blue-gray"
              >
                Explore the Universe with Us
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
                Cosmic Classroom is your gateway to the wonders of space. Our AI-powered 
                platform provides instant answers to your cosmic queries, while our 
                interactive visualizations let you explore the solar system and beyond.
                <br />
                <br />
                Whether you're a curious beginner or an aspiring astronomer, our 
                comprehensive educational content will take your space knowledge to new heights.
              </Typography>
              <Button variant="filled">Start Your Cosmic Journey</Button>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                <CardHeader floated={false} className="relative h-56">
                  <img
                    alt="Interactive Solar System"
                    src="/img/space.jpeg"
                    className="h-full w-full object-cover"
                  />
                </CardHeader>
                <CardBody>
                  <Typography variant="small" color="blue-gray" className="font-normal">Featured Experience</Typography>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                  >
                    Interactive Solar System
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    Embark on a virtual tour of our cosmic neighborhood. Explore planets, 
                    moons, and other celestial bodies in stunning detail with our 
                    interactive solar system model.
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-blue-gray-50/50 py-24 px-4">
        <div className="container mx-auto">
          <PageTitle section="Cosmic Resources" heading="Expand Your Space Knowledge">
            Dive deeper into the mysteries of the universe with our curated collection 
            of space education resources.
          </PageTitle>
          <div className="mx-auto mt-20 mb-48 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
              <Card
                key={title}
                color="transparent"
                shadow={false}
                className="text-center text-blue-gray-900"
              >
                <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                  {React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {title}
                </Typography>
                <Typography className="font-normal text-blue-gray-500">
                  {description}
                </Typography>
              </Card>
            ))}
          </div>
          <PageTitle section="Contact Mission Control" heading="Have questions or suggestions?">
            We're always looking to improve our cosmic educational experience. 
            Reach out to us with your thoughts!
          </PageTitle>
          <form className="mx-auto w-full mt-12 lg:w-5/12">
            <div className="mb-8 flex gap-8">
              <Input variant="outlined" size="lg" label="Full Name" />
              <Input variant="outlined" size="lg" label="Email Address" />
            </div>
            <Textarea variant="outlined" size="lg" label="Your Message" rows={8} />
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree to the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button variant="gradient" size="lg" className="mt-8" fullWidth>
              Send Message
            </Button>
          </form>
        </div>
      </section>
      <div className="bg-blue-gray-50/50">
        <Footer />
      </div>
    </>
  );
}

export default Home;