import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Spinner,
} from "@material-tailwind/react";

const CosmicHistory = ({ history = [], loading = false }) => {
  const [open, setOpen] = useState(0);
  
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  // Format the date in a user-friendly way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h4" color="white" className="mb-4">
          Your Space Questions
        </Typography>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-12 w-12 text-cosmic-primary" />
        </div>
      ) : history.length === 0 ? (
        <Card className="bg-cosmic-card-bg/60 border border-cosmic-border">
          <CardBody className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-cosmic-background flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-cosmic-text-muted">
                <path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z" />
              </svg>
            </div>
            <Typography variant="h5" color="white" className="mb-2">
              No questions yet
            </Typography>
            <Typography className="text-cosmic-text-secondary">
              Your space exploration journey will be recorded here. Start by asking a question about space!
            </Typography>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <Accordion
              key={item.id || index}
              open={open === index + 1}
              className="bg-cosmic-card-bg/80 border border-cosmic-border rounded-xl overflow-hidden"
            >
              <AccordionHeader
                onClick={() => handleOpen(index + 1)}
                className={`px-6 py-4 text-cosmic-text hover:text-cosmic-primary transition-colors ${
                  open === index + 1 ? "border-b border-cosmic-border" : ""
                }`}
              >
                <div className="flex-1 flex items-center text-left">
                  <div className="flex-1">
                    <Typography variant="h6" className="font-medium">
                      {item.question}
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-cosmic-text-muted mt-1"
                    >
                      {formatDate(item.createdAt)}
                    </Typography>
                  </div>
                </div>
              </AccordionHeader>
              
              <AccordionBody className="px-6 py-4">
                <div className="cosmic-answer text-cosmic-text">
                  {item.answer.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
};

export default CosmicHistory;