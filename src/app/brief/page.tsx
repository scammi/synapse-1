"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/trpc/react";

type BriefData = {
  title: string
  description: string
  skills: string[]
  projectSize: string
  projectDuration: string
  skillLevel: string
  pricingModel: string
  budgetFrom: string
  budgetTo: string
  screeningQuestions: string[]
  deliverables: string[]
  workSamples: string[]
  targetAudience: string
  budget: string
  deadline: string
}

const availableSkills = [
  "Content Marketing", "SEO", "Technical Content", "KOL Management", "Graphic Design",
  "Press Relations", "Growth Hacking", "Community Management", "Developer Relations",
  "Event Management", "Social Media Management", "Tokenomics"
]

const defaultScreeningQuestions = [
  "Describe your recent experience with similar projects.",
  "Why are you uniquely qualified to deliver the best work for this brief?",
  "Describe your general working style.",
  "Considering the current brief, what are some great examples you would draw inspiration from?"
]

export default function MarketingBriefForm() {
  const [step, setStep] = useState(0)
  const [briefData, setBriefData] = useState<BriefData>({
    title: '',
    description: '',
    skills: [],
    projectSize: '',
    projectDuration: '',
    skillLevel: '',
    pricingModel: 'flexible',
    budgetFrom: '',
    budgetTo: '',
    budget: '',
    screeningQuestions: [...defaultScreeningQuestions],
    deliverables: ['', '', ''],
    workSamples: [],
    targetAudience: '',
    deadline: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBriefData({ ...briefData, [e.target.name]: e.target.value })
  }

  const handleSkillToggle = (skill: string) => {
    setBriefData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setBriefData({ ...briefData, [name]: value })
  }

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...briefData.deliverables]
    newDeliverables[index] = value
    setBriefData({ ...briefData, deliverables: newDeliverables })
  }

  const handleWorkSampleAdd = (url: string) => {
    setBriefData({ ...briefData, workSamples: [...briefData.workSamples, url] })
  }

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5))
  const handleBack = () => setStep(prev => Math.max(prev - 1, 0))


  const createBrief =  api.brief.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting brief:', briefData)

    const budget = briefData.budgetFrom && briefData.budgetTo
      ? (Number(briefData.budgetFrom) + Number(briefData.budgetTo)) / 2
      : undefined;

    // Prepare the input for the create mutation
    const input = {
      // ...briefData,
      title: briefData.title,
      description: briefData.description,
      targetAudience: '',
      budget: Number(budget),
      // deadline: (new Date()).toString(), // Add a deadline field to your form if needed
      deadline: new Date(), // Add a deadline field to your form if needed
    };

    // Reset form or navigate away
    // setStep(0)
    createBrief.mutate(input)

    // setBriefData({
    //   title: '',
    //   description: '',
    //   skills: [],
    //   projectSize: '',
    //   projectDuration: '',
    //   skillLevel: '',
    //   pricingModel: 'flexible',
    //   budgetFrom: '',
    //   budgetTo: '',
    //   screeningQuestions: [...defaultScreeningQuestions],
    //   deliverables: ['', '', ''],
    //   workSamples: [],
    //   targetAudience: '',
    //   budget: '',
    //   deadline: '',
    // });
  }

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-lg">Let&apos;s get you set up with your first marketing brief and share it with the global Myosin network.</p>
            <p className="mt-4 text-lg">We just have a few questions, and we'll get you all set up. Ready to get started?</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNext} size="lg" className="mt-4">Let's Go</Button>
            </CardFooter>
          </Card>
        )
      case 1:
        return (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Brief Title</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Write a title for your Marketing Brief below.</Label>
                <Input
                  id="title"
                  name="title"
                  value={briefData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Content marketer needed for ecosystem growth"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Describe your marketing needs</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={briefData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your marketing needs to stand out to our members. First impressions matter!"
                  className="mt-2"
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBack} variant="outline">Back</Button>
              <Button onClick={handleNext} className="ml-2">Next</Button>
            </CardFooter>
          </Card>
        )
      case 2:
        return (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Skills Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">What skills are required to best fulfill your brief?</p>
              <div className="grid grid-cols-3 gap-4">
                {availableSkills.map(skill => (
                  <Button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    variant={briefData.skills.includes(skill) ? "default" : "outline"}
                    className="justify-start"
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBack} variant="outline">Back</Button>
              <Button onClick={handleNext} className="ml-2">Next</Button>
            </CardFooter>
          </Card>
        )
      case 3:
        return (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Scope of Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">How big is the project?</Label>
                <RadioGroup
                  onValueChange={(value) => handleRadioChange('projectSize', value)}
                  value={briefData.projectSize}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Large (Longer term, more complex initiatives)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium (Well-defined projects)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Small (Quick and straightforward tasks)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-lg font-semibold">How much time will your work take?</Label>
                <RadioGroup
                  onValueChange={(value) => handleRadioChange('projectDuration', value)}
                  value={briefData.projectDuration}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more-than-6-months" id="more-than-6-months" />
                    <Label htmlFor="more-than-6-months">More than 6 months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-6-months" id="3-6-months" />
                    <Label htmlFor="3-6-months">3-6 months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-3-months" id="1-3-months" />
                    <Label htmlFor="1-3-months">1-3 months</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="text-lg font-semibold">What is the desired skill level?</Label>
                <RadioGroup
                  onValueChange={(value) => handleRadioChange('skillLevel', value)}
                  value={briefData.skillLevel}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate (Looking for someone with moderate experience)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="senior" id="senior" />
                    <Label htmlFor="senior">Senior (Looking for substantial experience)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert">Expert (Looking for deep mastery and experience)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBack} variant="outline">Back</Button>
              <Button onClick={handleNext} className="ml-2">Next</Button>
            </CardFooter>
          </Card>
        )
      case 4:
        return (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg">Tell us about your budget so we can better match you with talent in your range.</p>
              <div>
                <Label className="text-lg font-semibold">Pricing Model</Label>
                <RadioGroup
                  onValueChange={(value) => handleRadioChange('pricingModel', value)}
                  value={briefData.pricingModel}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flexible" />
                    <Label htmlFor="flexible">Flexible price (Pay by the number of hours worked on a project)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed price (Pay as project milestones are completed)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex space-x-4">
                <div>
                  <Label htmlFor="budgetFrom">From</Label>
                  <div className="flex items-center mt-2">
                    <span className="mr-2">$</span>
                    <Input
                      id="budgetFrom"
                      name="budgetFrom"
                      value={briefData.budgetFrom}
                      onChange={handleInputChange}
                      type="number"
                      min="0"
                    />
                    <span className="ml-2">/hour</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="budgetTo">To</Label>
                  <div className="flex items-center mt-2">
                    <span className="mr-2">$</span>
                    <Input
                      id="budgetTo"
                      name="budgetTo"
                      value={briefData.budgetTo}
                      onChange={handleInputChange}
                      type="number"
                      min="0"
                    />
                    <span className="ml-2">/hour</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBack} variant="outline">Back</Button>
              <Button onClick={handleNext} className="ml-2">Next</Button>
            </CardFooter>
          </Card>
        )
      case 5:
        return (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Screening Questions, Deliverables, & Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">Screening Questions</Label>
                <p className="text-sm text-muted-foreground mb-2">Add custom questions or stick with the default questions, up to five total.</p>
                {briefData.screeningQuestions.map((question, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Checkbox checked={true} onCheckedChange={() => { console.log('hey bro') }} />
                    <Label>{question}</Label>
                  </div>
                ))}
                <Button variant="outline" className="mt-2">+ Write your own question(s)</Button>
              </div>
              <div>
                <Label className="text-lg font-semibold">Deliverables (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">Write out what kind of deliverables you're actually looking for. It's ok if you don't know, give it your best shot or skip altogether!</p>
                {briefData.deliverables.map((deliverable, index) => (
                  <Input
                    key={index}
                    value={deliverable}
                    onChange={(e) => handleDeliverableChange(index, e.target.value)}
                    placeholder={`Deliverable ${index + 1}`}
                    className="mb-2"
                  />
                ))}
              </div>
              <div>
                <Label className="text-lg font-semibold">Please share any relevant work samples as links or attachments.</Label>
                <Input
                  placeholder="https://www.examplelink.com"
                  value={briefData.workSamples[briefData.workSamples.length - 1] ?? ''}
                  onChange={(e) => handleWorkSampleAdd(e.target.value)}
                  className="mb-2"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
                  <p>Click here to attach any relevant files.</p>
                  <p className="text-sm text-muted-foreground">You can also drag and drop here.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBack} variant="outline">Back</Button>
              <Button onClick={handleSubmit} className="ml-2">Submit</Button>
            </CardFooter>
          </Card>
        )
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      {renderStep()}
    </div>
  )
}