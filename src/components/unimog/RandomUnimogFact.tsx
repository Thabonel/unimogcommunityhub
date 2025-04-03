
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
  "Unimogs are used in disaster relief operations worldwide due to their ability to navigate through rubble and debris.",
  "The Unimog's cab-over design provides excellent visibility, making it ideal for precision tasks in tight spaces.",
  "Unimogs are often used in vineyards for tasks like plowing and transporting grapes due to their compact size and versatility.",
  "The Unimog 404 was the first model to feature a petrol engine, catering to military and civilian markets alike.",
  "Unimogs have been used as mobile workshops, equipped with tools and equipment for field repairs in remote areas.",
  "The Unimog's flexible frame design prevents damage when driving over uneven terrain or obstacles like logs and rocks.",
  "In the 1960s, Unimogs were used in African safari tours due to their ability to handle rugged landscapes and carry passengers safely.",
  "Unimogs can operate in temperatures ranging from -40°C to +50°C, making them suitable for extreme climates.",
  "The Unimog is popular among expedition enthusiasts for its ability to carry heavy loads over long distances without breaking down.",
  "Some Unimogs are fitted with cranes that can lift up to 2 tonnes, making them useful for construction projects in remote areas.",
  "The Unimog's tires are designed with self-cleaning tread patterns to maintain traction on muddy or snowy surfaces.",
  "In 2005, a group of adventurers drove a fleet of Unimogs across the Sahara Desert, proving their endurance in extreme conditions.",
  "The Unimog's drivetrain includes differential locks that allow all wheels to spin at the same speed for maximum traction on slippery surfaces.",
  "A modified Unimog was once used as a camera vehicle in Hollywood films due to its ability to navigate rough terrain while carrying heavy equipment.",
  "The Unimog has been featured in several documentaries highlighting its role in global exploration and adventure travel.",
  "Modern Unimogs are equipped with GPS systems and advanced telemetry for precise navigation during complex tasks.",
  "The Unimog's modular design allows operators to add attachments like drills, augers, or even water tanks for firefighting operations.",
  "Some Unimogs are equipped with air compressors that can inflate tires or power pneumatic tools on the go!",
  "In mountainous regions, Unimogs are often used to transport goods where regular trucks cannot operate due to steep inclines or narrow paths.",
  "The Unimog's engine placement above the axles helps it avoid damage during water crossings or muddy conditions.",
  "Daimler-Benz introduced turbocharged engines in later models of the Unimog, increasing power while maintaining efficiency!",
  "In Switzerland, Unimogs are commonly used by ski resorts for snow grooming and maintenance tasks on slopes!",
  "The Unimog is one of the few vehicles capable of operating effectively under volcanic ash conditions during eruptions!",
  "Many European countries use Unimogs as ambulances in remote areas where traditional vehicles cannot reach patients quickly!",
  "Some models of the Unimog feature reversible driver seats, allowing operators to face attachments directly during operation!",
  "The first export market for the Unimog was South America, where it was used extensively in agriculture and forestry operations!",
  "Daimler-Benz offers customisation options for buyers, allowing them to tailor their Unimogs for specific industries or tasks!",
  "In urban areas, municipalities use smaller Unimogs for street cleaning and waste removal due to their compact size and manoeuvrability!",
  "The Unimog's headlights are mounted high on the cab to prevent damage during off-road driving or water crossings!",
  "Some military versions of the Unimog feature armoured cabs and reinforced frames for protection during combat missions!",
  "In 2019, a team drove a vintage Unimog across South America as part of a charity expedition, showcasing its reliability decades after production!",
  "A special amphibious version of the Unimog was developed for river crossings and swampy terrains but remains rare today!",
  "The Mercedes-Benz logo on the front grille of a Unimog is often oversized compared to other vehicles, symbolising its iconic status!",
  "Many enthusiasts restore vintage models of the Unimog as collector's items due to their historical significance and engineering quality!",
  "Modern models include climate-controlled cabs with touchscreen displays for monitoring vehicle performance during operations!",
  "The first fire truck based on a Unimog chassis was produced in 1956 and became popular among rural fire brigades worldwide!",
  "Some rail companies use modified Unimogs equipped with rail wheels for maintenance tasks on train tracks!",
  "The U 1300L model is one of the most widely used military versions of the Unimog due to its reliability under harsh conditions!",
  "In Germany, some farmers still use vintage models from the 1950s for agricultural tasks like plowing fields or transporting hay!",
  "A special 'Black Edition' of the Unimog was released in limited numbers featuring matte black paint and upgraded interiors!",
  "The flexible suspension system allows the wheels of a Unimog to remain grounded even when navigating large obstacles like boulders!",
  "Some modern models feature LED lighting systems that improve visibility during nighttime operations or foggy conditions!",
  "In Australia, modified versions of the Unimog are used by mining companies to transport workers through rugged terrain safely!",
  "Many enthusiasts convert old models into camper vans for long-distance travel across continents or remote wilderness areas!",
  "A single heavy-duty model can tow up to 20 tonnes, making it ideal for transporting large machinery or equipment across rough terrain!",
  "The U 5000 model features advanced hydraulics capable of operating multiple attachments simultaneously during complex tasks!",
  "Daimler-Benz introduced automatic transmission options in later models to improve ease of use during urban operations!",
  "Some municipalities use electric-powered versions of the Unimog for eco-friendly street cleaning and maintenance tasks!",
  "In mountainous regions like Nepal, modified versions of the Unimog are used as ambulances due to their ability to navigate steep paths quickly!",
  "A fleet of vintage military-grade models was restored by enthusiasts in France as part of a museum exhibit showcasing its history!",
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
