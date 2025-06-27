import React, { useState } from 'react'
import Modal from './ui/Modal'

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
      <footer className="bg-gradient-to-r from-purple-50 to-violet-100 border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-4">
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <button
                onClick={() => openModal('returns')}
                className="text-purple-600 hover:text-purple-800 font-medium underline"
              >
                Returns & Refunds
              </button>
              <button
                onClick={() => openModal('rental')}
                className="text-purple-600 hover:text-purple-800 font-medium underline"
              >
                Decorated Rental Tree Info
              </button>
              <button
                onClick={() => openModal('terms')}
                className="text-purple-600 hover:text-purple-800 font-medium underline"
              >
                Terms and Conditions
              </button>
            </div>
            
            {/* Copyright */}
            <p className="text-gray-600 text-sm font-manrope">
              © {currentYear} TJS Christmas Tree Rental. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Returns & Refunds Modal */}
      <Modal
        isOpen={activeModal === 'returns'}
        onClose={closeModal}
        title="Returns & Refunds"
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