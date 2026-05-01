import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const BusinessCard =()=>{
    return(
        <section className="py-16 bg-[#a0b830]">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-3xl">Are You a Business Owner?</CardTitle>
              <CardDescription className="text-center text-lg">
                Register your business and reach more customers in your target areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-8 space-y-4 max-w-md mx-auto">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Select up to 3 ZIP codes per subscription</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>No limit on the number of areas you can purchase</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Annual subscription model for continuous exposure</span>
                </li>
              </ul>
              <div className="text-center">
                <Button size="lg" asChild>
                  <a href="/register">Register As Vendor</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
}
export default BusinessCard;