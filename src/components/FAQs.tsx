import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqs = [
    {
      question: "How does AI scheduling work?",
      answer: "Our AI seamlessly integrates with your current practice management software, automating bookings, cancellations, and reminders without disrupting your workflow.",
    },
    {
      question: "Will AI chatbots sound robotic to my patients?",
      answer: "No! Our AI is trained to use natural, friendly language, ensuring a personalized and human-like interaction that enhances the patient experience.",
    },
    {
      question: "Can AI handle patient inquiries and follow-ups effectively?",
      answer: "Yes! AI can answer common patient questions (pricing, insurance, hours), send follow-up emails, and even remind patients about upcoming treatments.",
    },
    {
      question: "How soon can I start seeing results after implementation?",
      answer: "Most practices notice a boost in efficiency, fewer missed calls, and higher patient engagement within the first 30 days of using AI automation.",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-primary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg shadow-sm"
            >
              <AccordionTrigger className="px-6 hover:no-underline">
                <span className="text-left font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQs;