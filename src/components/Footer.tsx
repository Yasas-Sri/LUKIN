import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, PinIcon as Pinterest } from "lucide-react";

const footerLinks = {
  help: [
    { name: "Frequently Asked Questions", href: "#" },
    { name: "Delivery Information", href: "#" },
    { name: "Arrange A Return", href: "#" },
    { name: "Product Recall", href: "#" },
    { name: "Customer Services", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  shopping: [
    { name: "Next Unlimited", href: "#" },
    { name: "Next Credit Options", href: "#" },
    { name: "eGift Cards", href: "#" },
    { name: "Gift Cards", href: "#" },
    { name: "Flowers, Plants & Wine", href: "#" },
  ],
  departments: [
    { name: "Womens", href: "#" },
    { name: "Mens", href: "#" },
    { name: "Boys", href: "#" },
    { name: "Girls", href: "#" },
    { name: "Home", href: "#" },
    { name: "Furniture", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-20">
      {/* Top Bar: Social & Quick Links */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-neutral-500" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-neutral-500" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-neutral-500" />
            <Pinterest className="w-5 h-5 cursor-pointer hover:text-neutral-500" />
            <Youtube className="w-5 h-5 cursor-pointer hover:text-neutral-500" />
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="#" className="hover:underline underline-offset-4">My Account</Link>
            <Link href="#" className="hover:underline underline-offset-4">Store Locator</Link>
            <Link href="#" className="hover:underline underline-offset-4">Help</Link>
          </div>
        </div>
      </div>

  
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
      
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-neutral-600 hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Shopping With Us</h3>
            <ul className="space-y-3">
              {footerLinks.shopping.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-neutral-600 hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Departments</h3>
            <ul className="space-y-3">
              {footerLinks.departments.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-neutral-600 hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

       
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">More From Next</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-neutral-600 hover:underline">Next App</Link></li>
              <li><Link href="#" className="text-sm text-neutral-600 hover:underline">The Company</Link></li>
              <li><Link href="#" className="text-sm text-neutral-600 hover:underline">Careers @ Next</Link></li>
              <li><Link href="#" className="text-sm text-neutral-600 hover:underline">Media & Press</Link></li>
            </ul>
          </div>
        </div>
      </div>

    
      <div className="bg-neutral-50 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Next Retail Ltd. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4 text-[10px] text-neutral-400 uppercase tracking-widest">
            <Link href="#">Privacy & Cookies</Link>
            <Link href="#">Terms & Conditions</Link>
            <Link href="#">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}