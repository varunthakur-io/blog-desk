import React from 'react';
import { BookOpen, Code, Lightbulb, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <section className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Crafting Stories, Empowering Voices
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          At Blog Desk, we believe in the power of words to connect, inspire, and educate.
          Our platform is built for creators, developers, and thinkers who want to share their unique perspectives with the world.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="flex flex-col items-center text-center p-6 bg-card/60 shadow-lg border-border/40">
          <BookOpen className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">Our Mission</CardTitle>
          <CardDescription>
            To provide a seamless, intuitive, and beautiful space for authentic storytelling and knowledge sharing.
          </CardDescription>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 bg-card/60 shadow-lg border-border/40">
          <Lightbulb className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">Our Vision</CardTitle>
          <CardDescription>
            To foster a vibrant community where ideas flourish, conversations ignite, and every voice finds its audience.
          </CardDescription>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 bg-card/60 shadow-lg border-border/40">
          <Users className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="mb-2">Our Community</CardTitle>
          <CardDescription>
            Join a growing network of passionate writers and engaged readers. Your next big idea starts here.
          </CardDescription>
        </Card>
      </section>

      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-8">Why Choose Blog Desk?</h2>
        <div className="space-y-8 text-lg text-muted-foreground">
          <div className="flex items-start space-x-4">
            <Code className="h-8 w-8 text-secondary-foreground shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-xl text-foreground">Built for Performance</h3>
              <p>
                Leveraging modern web technologies like React, Vite, and Appwrite, Blog Desk offers
                blazing-fast load times and a highly responsive user interface. We prioritize performance
                so your content can shine without delays.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <BookOpen className="h-8 w-8 text-secondary-foreground shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-xl text-foreground">Intuitive Authoring Experience</h3>
              <p>
                Our rich text editor, powered by Tiptap, provides a comfortable and powerful writing environment.
                Focus on your words, and let us handle the formatting.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Lightbulb className="h-8 w-8 text-secondary-foreground shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-xl text-foreground">Engaging Reader Experience</h3>
              <p>
                Readers can enjoy a clean, distraction-free reading experience, complete with comments,
                likes, and easy sharing options. Dark mode ensures comfortable reading day or night.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to Start Sharing?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join Blog Desk today and turn your ideas into impactful stories.
        </p>
        {/* You might add a signup/login button here */}
        {/* <Button size="lg" className="px-8 py-3">Get Started</Button> */}
      </section>
    </div>
  );
};

export default About;