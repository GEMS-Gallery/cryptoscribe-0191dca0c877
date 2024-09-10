export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'generateDesign' : IDL.Func([IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
