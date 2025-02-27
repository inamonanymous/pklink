from app.ext import db
from app.model import get_uuid, dt

class DocumentRequests(db.Model):
    __tablename__ = 'document_requests'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    request_id = db.Column(db.String(255), db.ForeignKey('requests.id', ondelete="CASCADE"), unique=True, nullable=False)
    document_type = db.Column(db.Enum('cedula', 'brgy_certificate', 'brgy_clearance', 'business_permit'), nullable=False)
    reason = db.Column(db.String(45), nullable=False)
    additional_info = db.Column(db.String(255))
    resolved_at = db.Column(db.DateTime)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    request = db.relationship('Requests',  foreign_keys=[request_id], backref=db.backref('document_requests', cascade='all, delete-orphan'))

""" 
For employment purposes

"Job application"
"Pre-employment requirements"
"Company background check"
For school-related purposes

"Scholarship application"
"School enrollment"
"Student clearance"
For legal purposes

"Court proceedings"
"Notarization of documents"
"Affidavit requirements"
For financial transactions

"Bank account opening"
"Loan application"
"Insurance claims"
For personal identification or verification

"Proof of residency"
"Government ID application"
"Change of address validation"
For health-related matters

"Medical assistance"
"Hospital requirements"
"Health insurance claims"
For travel purposes

"Visa application"
"Passport processing"
"Travel clearance"
For property or business purposes

"Business permit application"
"Proof of property ownership"
"Transfer of property"
Other miscellaneous reasons

"Marriage requirements"
"Barangay ID application"
"Community service verification"
 """