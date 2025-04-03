
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// Enhanced array of Unimog facts
const unimogFacts = [
  "The name 'Unimog' is an abbreviation of the German term 'Universal-Motor-Gerät,' meaning 'Universal Motor Machine'.",
  "The first Unimog prototype was introduced in 1948 at a trade fair in Frankfurt, impressing audiences with its versatility.",
  "Unimogs were originally designed in the 1940s as agricultural machines to assist Germany's post-war recovery.",
  "Unimogs have equal-sized wheels, portal axles for high ground clearance, and a flexible frame that acts as part of the suspension.",
  "Many early Unimogs from the late 1940s are still operational today, showcasing their exceptional durability.",
  "Unimogs can operate a wide range of equipment, including snowplows, hydraulic cranes, and saws.",
  "Over 1,000 Unimogs were used by the Australian Defence Force during the 1980s and 1990s.",
  "Although initially designed for civilian purposes, Unimogs have been widely adopted by militaries worldwide.",
  "Unimogs have competed in extreme events like the Dakar Rally, showcasing their ruggedness and off-road prowess.",
  "Unimogs can ford through water up to 1.2 meters deep without preparation.",
  "Mercedes-Benz has produced over 380,000 Unimogs since 1948.",
  "Unimogs can climb slopes of up to 45 degrees thanks to their unique chassis design.",
  "While primarily manufactured in Germany, Unimogs have also been produced under license in Argentina.",
  "The Unimog's flexible frame allows the wheels to maintain ground contact even on extremely uneven terrain.",
  "Since 1951, Unimogs have been manufactured by Daimler-Benz and bear the Mercedes-Benz star.",
  "Unimogs are versatile vehicles used for tasks ranging from street sweeping to hedge trimming and wood chipping.",
  "The U 4023 and U 5023 models feature air-conditioned cabs and advanced gear systems for comfort in demanding operations.",
  "Early Unimogs were explicitly forbidden by their inventor from being used for military purposes—a rule later ignored.",
  "The first Unimog series featured an ox-head logo before adopting the Mercedes-Benz three-pointed star in 1953.",
  "Unimogs feature portal axles that provide exceptional ground clearance, making them ideal for off-road terrains.",
  "Unimogs are so versatile they've been deployed in war zones like Iraq and Afghanistan by various military forces.",
  "Unimog's design allows for incredible axle articulation, with wheels maintaining ground contact on the roughest terrain.",
  "The first Unimog prototype was painted green to blend in with agricultural fields, reflecting its farming roots.",
  "Unimogs can adjust tire pressure on the go, helping them adapt to different terrains like sand, mud, or rocky paths.",
  "The Unimog's suspension system allows each wheel to move independently, ensuring traction even on uneven ground.",
  "Unimogs are used in Antarctica for scientific expeditions due to their ability to handle extreme cold and icy terrain.",
  "In 1955, the Unimog 404 became the most popular military model, used by over 30 countries worldwide.",
  "Unimogs are often used in rail maintenance because they can be fitted with rail wheels to operate on train tracks.",
  "The Unimog has a loyal fanbase, with clubs and enthusiasts hosting rallies and events worldwide to showcase their vehicles.",
  "Some Unimogs are equipped with winches that can pull up to 10 tonnes, making them invaluable in recovery operations.",
  "The Mercedes-Benz museum in Stuttgart features a dedicated exhibit showcasing the history of the Unimog.",
  "A modified Unimog once climbed Chile's Ojos del Salado volcano, reaching an altitude of over 6,000 metres!",
  "The Unimog's modular design allows users to swap attachments quickly, making it one of the most versatile vehicles ever made.",
  "In the 1970s, Daimler-Benz introduced heavy-duty Unimogs capable of towing aircraft at airports worldwide.",
  "The Unimog is often called 'the Swiss Army knife of vehicles' due to its incredible versatility and adaptability.",
  "The Unimog's chassis is designed to flex slightly under pressure, helping it navigate rough terrains without damage.",
  "Modern Unimogs feature advanced safety systems like ABS and rollover protection, ensuring operator safety in extreme conditions.",
  "In addition to off-road use, Unimogs are commonly deployed for urban tasks like clearing snow from roads or maintaining parks.",
  "A special 'Funmog' edition was released in the 1990s with chrome detailing and luxury interiors aimed at private owners.",
  "The Unimog's engine is designed to run on various fuels, including diesel and biodiesel, making it adaptable for global use cases.",
  "Mercedes-Benz offers training programs for operators of Unimogs to ensure safe and efficient handling of the vehicle's features.",
  "The first factory-built firefighting Unimog was produced in 1956 and became a staple for fire brigades worldwide.",
  "Some Unimogs are equipped with snorkels that allow their engines to function underwater during deep river crossings or floods!",
  "A single Unimog can replace multiple vehicles by performing tasks like plowing snow, mowing grass, and transporting heavy loads simultaneously!",
  "The Unimog is a favourite among adventurers and overlanders due to its ability to carry supplies across remote areas for weeks at a time!",
  "In Germany, the iconic 'Unimog U' logo is instantly recognisable as a symbol of rugged reliability and engineering excellence!",
  "Modern Unimogs feature climate-controlled cabs with ergonomic seats designed for long hours of operation in harsh environments!",
  "Daimler-Benz has produced over 30 different series of Unimogs since their inception in 1948, each tailored for specific industries or tasks!",
  "In addition to civilian use, some countries use armoured versions of the Unimog for border patrols and peacekeeping missions!",
];

export const getRandomUnimogFact = (): string => {
  return unimogFacts[Math.floor(Math.random() * unimogFacts.length)];
};

interface RandomUnimogFactProps {
  showAsButton?: boolean;
}

export const RandomUnimogFact = ({ showAsButton = false }: RandomUnimogFactProps) => {
  const { toast } = useToast();
  
  const showRandomFact = () => {
    const fact = getRandomUnimogFact();
    
    toast({
      title: "Unimog Fact",
      description: fact,
      duration: 5000,
    });
  };
  
  if (showAsButton) {
    return (
      <Button 
        onClick={showRandomFact}
        variant="ghost" 
        size="sm"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Info className="h-4 w-4" />
        Random Unimog Fact
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={showRandomFact}
      variant="ghost"
      size="icon"
      className="rounded-full"
      title="Show a random Unimog fact"
    >
      <Info className="h-4 w-4" />
    </Button>
  );
};
