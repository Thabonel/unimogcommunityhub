
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BriefcaseIcon, GlobeIcon, HeartIcon, LightbulbIcon, MapIcon, UsersIcon } from 'lucide-react';

const Careers = () => {
  const benefits = [
    {
      icon: <GlobeIcon className="h-10 w-10 text-primary" />,
      title: "Remote-First",
      description: "Work from anywhere in the world. Our team is fully distributed across multiple time zones.",
    },
    {
      icon: <BriefcaseIcon className="h-10 w-10 text-primary" />,
      title: "Flexible Hours",
      description: "We care about results, not when you work. Set your own schedule that works for you.",
    },
    {
      icon: <HeartIcon className="h-10 w-10 text-primary" />,
      title: "Health Benefits",
      description: "Comprehensive health, dental, and vision coverage for you and your dependents.",
    },
    {
      icon: <MapIcon className="h-10 w-10 text-primary" />,
      title: "Travel Opportunities",
      description: "Join our team retreats and Unimog expeditions around the world.",
    },
    {
      icon: <LightbulbIcon className="h-10 w-10 text-primary" />,
      title: "Professional Growth",
      description: "Learning stipend and dedicated time for professional development.",
    },
    {
      icon: <UsersIcon className="h-10 w-10 text-primary" />,
      title: "Diverse Team",
      description: "Join a global team with diverse backgrounds and perspectives.",
    },
  ];

  const openings = [
    {
      title: "Senior Full Stack Developer",
      location: "Remote",
      type: "Full-time",
      description: "Help build and scale our platform serving Unimog enthusiasts worldwide.",
    },
    {
      title: "UX/UI Designer",
      location: "Remote",
      type: "Full-time",
      description: "Create beautiful, intuitive interfaces for our web and mobile applications.",
    },
    {
      title: "Community Manager",
      location: "Remote",
      type: "Full-time",
      description: "Nurture and grow our global community of Unimog owners and enthusiasts.",
    },
    {
      title: "Content Writer",
      location: "Remote",
      type: "Contract",
      description: "Create engaging content about Unimog vehicles, maintenance, and adventures.",
    },
  ];

  return (
    <Layout isLoggedIn={false}>
      <div className="relative py-20 terrain-gradient overflow-hidden">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="container relative text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl">
              Help us build the ultimate platform for Unimog enthusiasts and owners around the world.
            </p>
            <Button size="lg" className="bg-white text-unimog-800 hover:bg-white/90">
              View Open Positions
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
          <p className="text-lg text-muted-foreground">
            At Unimog Hub, we're passionate about building a platform that serves a global community of enthusiasts. 
            We offer competitive compensation and benefits in a flexible, remote-first environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="offroad-card">
              <CardContent className="pt-6">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
          <p className="text-lg text-muted-foreground">
            We're growing our team across multiple departments. See if there's a role that matches your skills and passion.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {openings.map((job, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="border-l-4 border-primary px-6 py-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                    <p className="mt-2">{job.description}</p>
                  </div>
                  <Button>
                    Apply Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
          <ol className="space-y-6 mb-8">
            <li className="flex gap-4">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg">Application Review</h3>
                <p className="text-muted-foreground">
                  We review your application materials to understand your background and experience.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg">Initial Interview</h3>
                <p className="text-muted-foreground">
                  A 30-45 minute video call to get to know you better and discuss your experience.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg">Technical Assessment</h3>
                <p className="text-muted-foreground">
                  A practical exercise relevant to the role you're applying for.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg">Team Interview</h3>
                <p className="text-muted-foreground">
                  Meet with potential team members to ensure a good cultural fit.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-semibold text-lg">Offer</h3>
                <p className="text-muted-foreground">
                  If there's a mutual fit, we'll extend an offer to join our team.
                </p>
              </div>
            </li>
          </ol>
          
          <div className="mt-12 text-center bg-muted p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Don't See a Role for You?</h3>
            <p className="mb-6 text-muted-foreground">
              We're always looking for talented individuals to join our team. Send us your resume and let us know how you can contribute.
            </p>
            <Button className="bg-primary">Send Open Application</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
