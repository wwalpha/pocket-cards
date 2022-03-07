//
//  DailyStudyView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct DailyStudyView: View {
    var interactor: DailyStudyBusinessLogic?
    
    @ObservedObject var viewModel = DailyStudyViewModel()
    
    var body: some View {
        if viewModel.title.isEmpty {
            Text("Loading....")
                .onAppear {
                    interactor?.loadQuestion()
                }
        } else if viewModel.title == "Nothing" {
            Text("Nothing....")
        } else {
            ChoiceQuestion(
                question: viewModel.title,
                choices: viewModel.choices,
                isShowError: viewModel.isShowError,
                onChoice: interactor!.onChoice
            )
        }
    }
}

extension DailyStudyView: DailyStudyDisplayLogic {
    func showError(index: String) {
        self.viewModel.isShowError = index
    }
    
    func showNext(title: String, choices: [String]) {
        self.viewModel.title = title
        self.viewModel.choices = choices
        self.viewModel.isShowError = ""
    }
    
    func showNothing() {
        self.viewModel.title = "Nothing"
    }
}

extension DailyStudyView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyStudyInteractor(subject: SUBJECT.LANGUAGE)
        let presenter = DailyStudyPresenter()
        
        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view
        
        return view
    }
}

struct DailyStudyView_Previews: PreviewProvider {
    static var previews: some View {
        DailyStudyView()
    }
}
