import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from './ui/Modal'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import CaretRightIcon from './ui/CaretRightIcon'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal = (modalType: string) => {
    setActiveModal(modalType)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <>
      <footer className="mt-auto bg-[#510256] relative border-t-2 border-t-[#d9a66c] overflow-hidden">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 bg-center bg-cover z-0" 
          style={{ backgroundImage: 'url(/assets/images/overlay.png)', opacity: 0.16, top: '-568px' }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-12 relative z-10">
        <style>{`
          .py-12 { 
            padding-top: 24px; 
            padding-bottom: 0rem; 
          }
          .bg-center { 
            background-position: center; 
            top: -568px; 
          }
        `}</style>
        <style>{`
          @media (min-width: 1024px) {
            .lg\:px-0 {
              padding-left: 0rem;
              padding-right: 0rem;
            }
          }
          /* CSS override removed as we're no longer using md:col-start-7 */
        `}</style>
          <div className="grid grid-cols-1 md:grid-cols-10 md:grid-flow-row-dense" style={{ gap: '64px 70px', marginTop: '30px' }}>
            {/* Logo and Awards */}
            <div className="flex flex-col items-center md:items-start md:col-span-3">
              <div className="flex flex-col items-center md:items-start mb-6">
                <img
                  src="/assets/images/logo.webp"
                  alt="Twinkle Jingle Logo"
                  className="h-[125px] w-[160px] object-contain mb-2"
                />
                <div 
                   className="text-center md:text-left"
                   style={{
                     fontFamily: '"Dancing Script", sans-serif',
                     fontStyle: 'normal',
                     fontWeight: 500,
                     color: 'rgb(217, 166, 108)',
                     fontSize: '16px',
                     lineHeight: '21px'
                   }}
                 >
                  Event planning and decoration services
                </div>
              </div>
              <div className="mt-0">
                <div className="e-con-full e-flex e-con e-child" style={{ display: 'flex', gap: '16px', alignContent: 'flex-end', alignItems: 'flex-end', marginRight: '0' }}>
                  <div className="elementor-widget elementor-widget-image">
                    <div className="elementor-widget-container">
                      <img width="129" height="114" src="/assets/images/award  1.webp" className="attachment-large size-large" alt="" />
                    </div>
                  </div>
                  <div className="elementor-widget elementor-widget-image">
                    <div className="elementor-widget-container">
                      <img width="129" height="101" src="/assets/images/award 2.webp" className="attachment-large size-large" alt="" />
                    </div>
                  </div>
                  <div className="elementor-widget elementor-widget-image">
                    <div className="elementor-widget-container">
                      <img width="160" height="143" src="/assets/images/award 3.webp" className="attachment-large size-large" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="md:col-span-2">
              <h3 className="font-dosis font-bold text-white text-xl leading-[26px] mb-4">Quick Links</h3>
              <ul className="custom-space-y">
              <style>{`
                .custom-space-y > :not([hidden]) ~ :not([hidden]) {
                  --tw-space-y-reverse: 0;
                  margin-top: calc(13px * calc(1 - var(--tw-space-y-reverse)));
                  margin-bottom: calc(25px * var(--tw-space-y-reverse));
                }
              `}</style>
                <li>
                  <a href="https://twinklejingle.net/" target="_blank" rel="noopener noreferrer" className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center">
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Home
                  </a>
                </li>
                <li>
                  <a href="https://twinklejingle.net/#about" target="_blank" rel="noopener noreferrer" className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center">
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> About Us
                  </a>
                </li>
                <li>
                  <a href="https://twinklejingle.net/#services" target="_blank" rel="noopener noreferrer" className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center">
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Our Services
                  </a>
                </li>
                <li>
                  <a href="https://twinklejingle.net/portfolio/" target="_blank" rel="noopener noreferrer" className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center">
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Portfolio
                  </a>
                </li>
                <li>
                  <a href="https://twinklejingle.net/#testimonials" target="_blank" rel="noopener noreferrer" className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center">
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Testimonials
                  </a>
                </li>
                <li>
                  <Link to="/admin" className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center">
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Admin
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal Links */}
            <div className="md:col-span-2">
              <h3 className="font-dosis font-bold text-white text-xl leading-[26px] mb-4">LEGAL LINKS</h3>
              <ul className="custom-space-y">
                <li>
                  <button
                    onClick={() => openModal('terms')}
                    className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center text-left"
                  >
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Product Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('rental')}
                    className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center text-left"
                  >
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Services Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('privacy')}
                    className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center text-left"
                  >
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('cancellation')}
                    className="font-manrope text-[#FFFFFFD4] text-[15px] leading-[23px] hover:text-[#d9a66c] flex items-center text-left"
                  >
                    <CaretRightIcon className="w-4 h-4 mr-[11px]" color="white" /> Cancellation Policy
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Follow Us */}
            <div className="md:col-span-2">
              <h3 className="font-dosis font-bold text-white text-xl leading-[26px] mb-4">Follow Us</h3>
              <p className="font-manrope font-bold italic text-[17px] leading-[26px] text-[#ffffffd4] mb-4">
                Join our festive world for decor inspiration, exclusive previews, and behind-the-scenes magic.
              </p>
              <div className="flex space-x-3 mt-[40px]">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  <FaFacebookF className="text-white" size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  <FaInstagram className="text-white" size={18} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  <FaLinkedinIn className="text-white" size={18} />
                </a>
              </div>
              <style>{`
                .social-icon {
                  transition: transform 0.3s ease-in-out;
                }
                .social-icon:hover {
                  transform: translateY(-8px);
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
              `}</style>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-dashed border-[#ffffff45] mt-8 py-[26px] text-center">
            <p className="font-manrope text-white text-[17px] leading-[26px]">
              © {currentYear} Twinkle Jingle Services. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={closeModal}
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <p>
            We accept returns for unused, unopened products sold on our web store or physical store within 14 days of purchase. Please ensure the product is in its original packaging. Contact us on how to mail your returns.
          </p>
          <p>
            Purchase of products will not be delivered but are available for self-collection only. Contact us on how to collect your products - +65 8339 2574 or sales@twinklejingle.net
          </p>
          <p>
            Purchase of plain (ie. un-decorated) live or artificial trees for self-decoration can be ordered 6 weeks and 1 week in advance respectively.
          </p>
          <p>
            Should you receive a wrong or damaged item, please take a picture and inform Twinkle Jingle Services within 48 hours so we can rectify the matter as soon as possible. Returns or refunds after 2 days will not be entertained.
          </p>
        </div>
      </Modal>
      
      {/* Cancellation Policy Modal */}
      <Modal
        isOpen={activeModal === 'cancellation'}
        onClose={closeModal}
        title="Cancellation Policy"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">CLIENT CANCELLATION after confirmation of design and decoration services:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>28 days before: Full refund minus admin fees.</li>
              <li>14-28 days before: 50% refund.</li>
              <li>Less than 14 days before: No refund.</li>
            </ul>
            <p className="mt-2">Costs for designs, materials, or labour may be deducted from refunds.</p>
          </div>
          <p>
            Changes to the prior agreed upon date/time of installation must be requested 5 days in advance.
          </p>
          <p>
            Changes to the prior agreed upon date/time of dismantling may be subject to a $350 surcharge.
          </p>
        </div>
      </Modal>

      {/* Decorated Rental Tree Info Modal */}
      <Modal
        isOpen={activeModal === 'rental'}
        onClose={closeModal}
        title="Decorated Rental Tree Info"
      >
        <div className="space-y-4">
          <p>
            All decorated tree prices indicate rental costs. To purchase, you may request for a quote or purchase plain trees and individual decor pieces for your own manual decorating.
          </p>
          <p>
            Rental tree prices in shop already include DELIVERY, SETUP & TEARDOWN, of which dates need to be indicated at Checkout.
          </p>
          <p>
            Please confirm orders at least 7 days in advance for artificial tree orders and 6 weeks for live tree orders. Pre-orders are while stocks last.
          </p>
          <p>
            Additional costs like longer rental period, urgent orders and boom/scissor lift for trees 11ft & up, can all be indicated at Checkout and the final price will be manually added to invoice.
          </p>
          <p>
            Payment is non-refundable once large-scale decorations/tree orders have been delivered on-site and setup services provided.
          </p>
          <p>
            Twinkle Jingle Services reserves the right to adjust pricing for customisations. Prices for live Christmas trees are estimated, and they will be accurately updated from October of each year.
          </p>
          <p>
            Twinkle Jingle Services also reserves the right to substitute decorations or colour schemes in the event of unavailability, but client will be informed before changes are approved.
          </p>
        </div>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        isOpen={activeModal === 'terms'}
        onClose={closeModal}
        title="Terms and Conditions"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">INSTALLATION OF TREE / DECORATIONS:</h4>
            <p>Changes to the prior agreed upon date/time of installation must be requested 5 days in advance.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">DISMANTLING OF TREE / DECORATIONS:</h4>
            <p>Changes to the prior agreed upon date/time of dismantling may be subject to a $350 surcharge.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">CLIENT CANCELLATION after confirmation of design and decoration services:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>28 days before: Full refund minus admin fees.</li>
              <li>14-28 days before: 50% refund.</li>
              <li>Less than 14 days before: No refund.</li>
            </ul>
            <p className="mt-2">Costs for designs, materials, or labour may be deducted from refunds.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">RUSH ORDERS for the trees and decorations may be indicated in Checkout where our staff will manually add it after confirmation of payment:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Decorated live trees in 10 days +$800</li>
              <li>Decorated artificial trees in 3 days +$350</li>
              <li>Priority decor installation services in 3 days +$350</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">SCISSOR / BOOM LIFT:</h4>
            <p>Required for artificial or live trees above 10 feet (more than 3.3m), which will be subject to additional charge of $1500 onwards, and may be manually invoiced to client.</p>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            For more info, refer to the truncated "Services Terms & Conditions" on our website. A full legal clause will be sent to you for approval upon successful purchase and confirmation of order.
          </p>
        </div>
      </Modal>
    </>
  )
}

export default Footer