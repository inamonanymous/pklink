"""empty message

Revision ID: 926d9507294c
Revises: 
Create Date: 2025-02-27 22:22:52.872908

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '926d9507294c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('admin', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['user_id'])

    with op.batch_alter_table('announcements', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['posts_id'])
        batch_op.drop_constraint('announcements_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'posts', ['posts_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('document_requests', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['request_id'])
        batch_op.drop_constraint('document_requests_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'requests', ['request_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('health_support_requests', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['request_id'])

    with op.batch_alter_table('incidents', schema=None) as batch_op:
        batch_op.drop_constraint('incidents_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('postcomments', schema=None) as batch_op:
        batch_op.drop_constraint('postcomments_ibfk_2', type_='foreignkey')
        batch_op.drop_constraint('postcomments_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'posts', ['post_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.drop_constraint('posts_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'users', ['created_by'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('requests', schema=None) as batch_op:
        batch_op.drop_constraint('requests_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('userdetails', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['user_id'])
        batch_op.drop_constraint('userdetails_ibfk_4', type_='foreignkey')
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('verifiedusers', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['user_id'])
        batch_op.drop_constraint('verifiedusers_ibfk_1', type_='foreignkey')
        batch_op.drop_constraint('verifiedusers_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key(None, 'users', ['verified_by'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('verifiedusers', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('verifiedusers_ibfk_2', 'users', ['verified_by'], ['id'])
        batch_op.create_foreign_key('verifiedusers_ibfk_1', 'users', ['user_id'], ['id'])
        batch_op.drop_constraint(None, type_='unique')

    with op.batch_alter_table('userdetails', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('userdetails_ibfk_4', 'users', ['user_id'], ['id'])
        batch_op.drop_constraint(None, type_='unique')

    with op.batch_alter_table('requests', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('requests_ibfk_1', 'users', ['user_id'], ['id'])

    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('posts_ibfk_1', 'users', ['created_by'], ['id'])

    with op.batch_alter_table('postcomments', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('postcomments_ibfk_1', 'posts', ['post_id'], ['id'])
        batch_op.create_foreign_key('postcomments_ibfk_2', 'users', ['user_id'], ['id'])

    with op.batch_alter_table('incidents', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('incidents_ibfk_1', 'users', ['user_id'], ['id'])

    with op.batch_alter_table('health_support_requests', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')

    with op.batch_alter_table('document_requests', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('document_requests_ibfk_1', 'requests', ['request_id'], ['id'])
        batch_op.drop_constraint(None, type_='unique')

    with op.batch_alter_table('announcements', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('announcements_ibfk_1', 'posts', ['posts_id'], ['id'])
        batch_op.drop_constraint(None, type_='unique')

    with op.batch_alter_table('admin', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')

    # ### end Alembic commands ###
