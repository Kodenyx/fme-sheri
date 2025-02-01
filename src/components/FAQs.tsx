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
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on complexity and scope. A typical web development project can take 8-12 weeks, while smaller projects might take 4-6 weeks.",
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes, we offer continuous support and maintenance packages to ensure your digital solutions remain up-to-date and perform optimally.",
    },
    {
      question: "What is your development process?",
      answer: "We follow an agile methodology with regular client check-ins. This includes discovery, planning, design, development, testing, and deployment phases.",
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