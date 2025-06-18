
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutCreator = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/placeholder.svg" alt="Sheri Otto" />
                  <AvatarFallback className="text-2xl">SO</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Meet Sheri Otto</h2>
                  <p className="text-lg text-gray-600 mb-4">
                    The messaging strategist behind millions in client revenue. Sheri built this tool after seeing too many brilliant founders fail because they couldn't communicate their value clearly.
                  </p>
                  <p className="text-lg text-gray-600">
                    Her proprietary frameworks have helped over 500 companies transform their messaging from confusing to compelling, turning prospects into profits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutCreator;
